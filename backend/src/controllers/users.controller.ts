import { Request, Response } from "express";
import userModel from "../models/user.model";
import tempUserModel from "../models/tempUser.model";
import bcrypt from "bcrypt";
import validateFields from "../helpers/validateMissingFields.helper";
import { sendOtpMail } from "../helpers/otpMail.helper";

// register new user
async function registerUser(req: Request, res: Response) {
  // get username email and password from body
  const { username, email, password } = req.body;

  // validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format. Please enter a valid email",
    });
  }

  // validate missing fields
  const hasError = validateFields({ username, email, password }, res);
  if (hasError) return;

  // checking for duplicate entries
  const duplicate = await userModel.findOne({ email: email }).exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Email already exists. User another email" });
  }

  // create new temp user
  try {
    // hashing password
    const encryptedPass = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // temp user to validate OTP
    await tempUserModel.create({
      username,
      email,
      password: encryptedPass,
      OTP: otp,
      OTPexpires: new Date(Date.now() + 5 * 60 * 1000),
    });

    // send OTP
    await sendOtpMail(email, otp);
    return res
      .status(201)
      .json({ message: "OTP sent to email for verification" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! something went wrong. Try again",
    });
  }
}

// verify OTP to register user
async function verifyOTP(req: Request, res: Response) {
  // get email and OTP from body
  const { email, otp } = req.body;

  try {
    // find the temp user with the email
    const tempUser = await tempUserModel.findOne({ email: email }).exec();
    if (!tempUser) {
      return res.status(404).json({ error: "Invalid OTP" });
    }

    // validate OTP
    if (tempUser.OTP !== otp || tempUser.OTPexpires.getTime() < Date.now()) {
      return res.status(404).json({ error: "Invalid OTP" });
    }

    // create new user of valid OTP
    await userModel.create({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
    });

    // delete temp user
    await tempUser.deleteOne({ email: email });

    return res
      .status(201)
      .json({ message: "Congratulations!!! User registered successfully." });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! something went wrong. Try again",
    });
  }
}

export { registerUser, verifyOTP };
