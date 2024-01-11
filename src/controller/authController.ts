import { Request, Response } from "express";
import { getRepository, MoreThan } from "typeorm";
import { validate, ValidationError } from "class-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserDto } from "../dto/user.dto";
import { CustomError } from "../utils/CustomError";
import { Users } from "../entity/User";
import { sendEmail } from "../utils/emailService";
import { generateToken } from "../utils/generateToken";

const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const userDto: UserDto = req.body;
  try {
    // Validate user data
    const validationErrors: ValidationError[] = await validate(userDto);
    if (validationErrors.length > 0) {
      const errorMessages = validationErrors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      return res.status(400).json({ message: errorMessages.join(", ") });
    }

    // Check if the user already exists
    const userRepository = getRepository(Users);
    const existingUser = await userRepository.findOne({
      where: { email: userDto.email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the user's password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userDto.password, saltRounds);
    const verificationToken = generateToken();
    const expires = new Date(); // Token expires in 24 hours
    expires.setHours(expires.getHours() + 24); // Setting token to expire in 24 hours

    const verficationUrl = `localhost:3001/api/users/verify-email?token=${verificationToken}`;
    const content = `Please verify your email by clicking on this link: ${verficationUrl}`;

    // Create new user
    const newUser = userRepository.create({
      email: userDto.email,
      fullname: userDto.fullname,
      password: hashedPassword,
      emailValidationToken: verificationToken,
      emailVerificationTokenExpires: expires,
    });

    // Save the user to the database
    await userRepository.save(newUser);
    await sendEmail(newUser, verficationUrl, "Email verfication", content);

    // Send a success response
    return res.status(201).json({
      message: `A verification code has been sent to your email address to
         complete the registration process.Please check your inbox
          and follow the instructions to activate your account.`,
      data: {
        id: newUser.id,
        fullName: newUser.fullname,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);

    // Handle custom errors
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    // Handle unexpected errors
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const verifiedEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({
      where: { emailValidationToken: String(token) },
    });
    if (
      !user ||
      user.emailVerificationTokenExpires === null ||
      new Date() > user.emailVerificationTokenExpires
    ) {
      throw new CustomError(400, "Invalid token");
    }

    if (user) {
      user.isEmailVerified = true;
      user.emailValidationToken = null;
      user.emailVerificationTokenExpires = null;
      await userRepository.save(user);
      res.status(200).json({ message: "Email verified successfully" });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userRepository = getRepository(Users);
  try {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new CustomError(400, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("isPasswordValid: ", isPasswordValid);
    if (!isPasswordValid) {
      throw new CustomError(400, "Invalid email or password");
    }

    if (!user.isEmailVerified) {
      throw new CustomError(400, "Please verify your email before logging in");
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, userId: user.id },
      "hhhsahueueue747ehejewennhwheeegwwewdwkwnbhdwhuy",
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      id: user.id,
      email: user.email,
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const validationErrors: ValidationError[] = await validate(email);
    if (validationErrors.length > 0) {
      const errorMessages = validationErrors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      return res.status(400).json({ message: errorMessages.join(", ") });
    }
    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new CustomError(400, "user not found");
    }
    const resetToken = generateToken();
    // Set an expiration time for the reset token (e.g., 1 hour from now)
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    // Store the reset token and expiration in the user record
    user.emailValidationToken = resetToken;
    user.emailVerificationTokenExpires = expires;
    await userRepository.save(user);
    // Send a password reset email to the user
    const resetPasswordEmailSubject = "Password Reset Request";
    const resetPasswordUrl = `localhost:3001/api/users/request-password-reset?token=${resetToken}`;
    const resetPasswordEmailContent = `
      Click the link to reset your password: ${resetPasswordUrl}
    `;

    await sendEmail(
      user,
      resetPasswordUrl,
      resetPasswordEmailSubject,
      resetPasswordEmailContent
    );
  } catch (error: any) {
    // Handle custom errors
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    // Handle unexpected errors
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const userRepository = getRepository(Users);
    const user = await userRepository.findOne({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await userRepository.save(user);

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    throw new CustomError(500, "Something went wrong");
  }
};

export {
  registerUser,
  loginUser,
  verifiedEmail,
  requestPasswordReset,
  resetPassword,
};
