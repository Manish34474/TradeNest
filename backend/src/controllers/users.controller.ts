import { Request, Response } from "express";
import userModel from "../models/user.model";
import tempUserModel from "../models/tempUser.model";
import bcrypt from "bcrypt";
import validateFields from "../helpers/validateMissingFields.helper";
import { sendOtpMail } from "../helpers/otpMail.helper";

// get all users
async function getAllUsers(req: Request, res: Response) {
  // page number and limit for pagination
  const page =
    typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
  const limit =
    typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
  const skip = (page - 1) * limit;

  // find users in database
  const users = await userModel
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // if no users found
  if (users.length === 0) {
    return res.status(204).json({
      users: [],
      message: "No users found",
      currentPage: page,
      totalPages: 0,
      totalUsers: 0,
    });
  }

  // if users found
  const totalUsers = await userModel.countDocuments();
  const totalPages = Math.ceil(totalUsers / limit);

  return res.status(200).json({
    users,
    currentPage: page,
    totalPages: totalPages,
    totalUsers: totalUsers,
  });
}

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
    await tempUserModel.deleteOne({ email: email });

    return res
      .status(201)
      .json({ message: "Congratulations!!! User registered successfully." });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! something went wrong. Try again",
    });
  }
}

// delete user
async function deleteUser(req: Request, res: Response) {
  // get email from body
  const { email } = req.body;

  try {
    // check if the user exists
    const existingUser = await userModel.findOne({ email: email }).exec();
    if (!existingUser) {
      return res.status(404).json({ error: "User does not exist" });
    }

    //delete user
    await userModel.deleteOne({ email: email });

    return res.status(201).json({ message: "User deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! something went wrong. Try again",
    });
  }
}

export { getAllUsers, registerUser, verifyOTP, deleteUser };
