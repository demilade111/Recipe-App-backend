import nodemailer from "nodemailer";
import { Users } from "../entity/User";
import { generateVerificationToken } from "./generateToken";

export async function sendValidationEmail(user: Users): Promise<void> {
  try {
    const verificationToken = generateVerificationToken();
    const expires = new Date(); // Token expires in 24 hours
    expires.setHours(expires.getHours() + 24);
    user.emailValidationToken = verificationToken;
    user.emailVerificationTokenExpires = expires;

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // e.g., 'Gmail', 'Outlook', or use your own SMTP server
      auth: {
        user: "demiladealuko111@gmail.com",
        pass: "Oluwademiladealuko1!",
      },
    });
    const verificationUrl = `localhost:3001/verify-email?token=${verificationToken}`;
    // Define the email message
    const mailOptions = {
      from: "demiladealuko111@gmail.com", // Sender email address
      to: user.email, // Recipient email address
      subject: "Validation Code",
      text: `Please verify your email by clicking on this link: ${verificationUrl}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error("Error sending validation email:", error);
    // Handle email sending errors, e.g., log or return an error response
  }
}
