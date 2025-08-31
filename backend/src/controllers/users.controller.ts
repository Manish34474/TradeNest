import { Request, Response } from "express";
import userModel from "../models/user.model";
import tempUserModel from "../models/tempUser.model";
import bcrypt from "bcrypt";
import validateFields from "../helpers/validateMissingFields.helper";
import { sendOtpMail } from "../helpers/otpMail.helper";
import crypto from "crypto";
import uploadToCloudinary from "../helpers/uploadToCloudinary.helper";

// get all users
async function getAllUsers(req: Request, res: Response) {
  // page number and limit for pagination
  const page =
    typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
  const limit =
    typeof req.query.limit === "string" ? parseInt(req.query.limit) : 12;
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
  const { username, email, pass, userType } = req.body;

  // validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[#$%&@!])[A-Za-z\d#$%&@!]{8,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format. Please enter a valid email",
    });
  }
  if (!passwordRegex.test(pass)) {
    return res.status(400).json({
      message:
        "Password must have at least 8 letters and should contain ( a Number and a Special Character)",
    });
  }

  // validate missing fields
  const hasError = validateFields({ username, email, pass, userType }, res);
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
    // delete if existing temp user
    await tempUserModel.findOneAndDelete({ email: email }).exec();

    // hashing password
    const encryptedPass = await bcrypt.hash(pass, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // temp user to validate OTP
    await tempUserModel.create({
      username,
      email,
      password: encryptedPass,
      OTP: otp,
      OTPexpires: new Date(Date.now() + 5 * 60 * 1000),
      userType,
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

  // validate missing fields
  const hasError = validateFields({ email, otp }, res);
  if (hasError) return;

  try {
    // find the temp user with the email
    const tempUser = await tempUserModel.findOne({ email: email }).exec();
    if (!tempUser) {
      return res.status(404).json({ error: "Invalid OTP" });
    }

    const Otp = parseInt(otp);

    // validate OTP
    if (tempUser.OTP !== Otp || tempUser.OTPexpires.getTime() < Date.now()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    let roles: any = { user: 848 };
    if (tempUser.userType === "seller") {
      roles.seller = 747;
    }

    // create new user of valid OTP
    await userModel.create({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      roles,
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

// update profile picture
async function updateProfile(req: Request, res: Response) {
  // get email from body
  const { email } = req.body;

  // get image from files
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required." });
  }

  // change/update profile picture
  try {
    const user = await userModel.findOne({ email: email }).exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // upload profile to cloudinary
    const public_id = crypto.randomBytes(10).toString("hex");
    const imageURL = await uploadToCloudinary(req.file.buffer, public_id);

    // update picture
    user.profile = { imageURL, public_id };
    await user.save();

    return res
      .status(200)
      .json({ message: "Profile picture updated successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! something went wrong. Try again",
    });
  }
}

// delete user
async function deleteUser(req: Request, res: Response) {
  // get email from body
  const { email } = req.params;

  // validate missing fields
  const hasError = validateFields({ email }, res);
  if (hasError) return;

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

export { getAllUsers, registerUser, verifyOTP, updateProfile, deleteUser };
