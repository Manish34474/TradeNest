import { Router } from "express";
import {
  getAllUsers,
  registerUser,
  verifyOTP,
  deleteUser,
  updateProfile,
} from "../controllers/users.controller";
import catchAsync from "../helpers/catchAsync.helper";

const usersRouter = Router();

usersRouter.get("/all", catchAsync(getAllUsers));
usersRouter.post("/register", catchAsync(registerUser));
usersRouter.post("/verify", catchAsync(verifyOTP));
usersRouter.put("/profile", catchAsync(updateProfile));
usersRouter.delete("/delete", catchAsync(deleteUser));

export default usersRouter;
