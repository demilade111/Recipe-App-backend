import e, { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate, ValidationError } from "class-validator";
import { hash } from "bcrypt"; // Ensure you have the bcrypt package installed
import { UserDto } from "../dto/user.dto"; // Path to your UserDto
import { CustomError } from "../utils/CustomError"; // Path to your CustomError
import { Users } from "../entity/User";
import { sendValidationEmail } from "../utils/emailService";

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
    const hashedPassword = await hash(userDto.password, 10);

    // Create new user
    const newUser = userRepository.create({
      email: userDto.email,
      fullname: userDto.fullname,
      password: hashedPassword,
    });

    // Save the user to the database
    await userRepository.save(newUser);
    await sendValidationEmail(newUser);
    console.log("error sending the email");

    // Send a success response
    return res.status(201).json({
      message: "User created successfully",
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
const loginUser = async (req: Request, res: Response) => {
  res.send("login");
};

export { registerUser, loginUser };
