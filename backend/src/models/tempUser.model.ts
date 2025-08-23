import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    roles: {
      user: {
        type: Number,
        default: 848,
      },
      seller: Number,
      admin: Number,
    },
    OTP: {
      type: Number,
      require: true,
    },
    OTPexpires: {
      type: Date,
      default: new Date(Date.now() + 5 * 60 * 1000),
      require: true,
    },
    userType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const tempUserModel = mongoose.model("TempUser", tempUserSchema);

export default tempUserModel;
