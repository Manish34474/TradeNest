// src/utils/sendOtpMail.ts
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { mailConfig, mailGenConfig } from "../config/mailOptions.config";

export async function sendOtpMail(email: string, otp: string): Promise<void> {
  // Create transporter
  const transporter = nodemailer.createTransport(mailConfig);

  // Configure mailgen
  const mailGenerator = new Mailgen(mailGenConfig);

  // Create email body
  const emailBody = {
    body: {
      title: "Trade Nest - OTP Verification",
      intro: `Your One-Time Password (OTP) is: **${otp}**`,
      table: {
        data: [
          {
            OTP: otp,
            "Expires In": "5 minutes",
          },
        ],
      },
      outro: "If you did not request this code, please ignore this email.",
    },
  };

  // Generate email HTML
  const htmlContent = mailGenerator.generate(emailBody);

  // Email options
  const message = {
    from: '"Trade Nest" <bloggingforeverything@gmail.com>',
    to: email,
    subject: "Your OTP Code - Expires in 5 Minutes",
    html: htmlContent,
  };

  // Send the email
  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email.");
  }
}
