import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    refreshToken: String,

    // other details of the user
    profile: {
      imageURL: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
