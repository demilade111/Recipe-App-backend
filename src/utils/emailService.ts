import nodemailer from "nodemailer";
import { Users } from "../entity/User";

export async function sendEmail(
  user: Users,
  verificationUrls: string,
  subject: string,
  content: string
): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define the email message
    const mailOptions = {
      from: "demiladealuko111@gmail.com", // Sender email address
      to: user.email, // Recipient email address
      subject: subject,
      text: content,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.error("Error sending validation email:", error);
    // Handle email sending errors, e.g., log or return an error response
  }
}
