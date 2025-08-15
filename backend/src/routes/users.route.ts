import { Router } from "express";
import {
  getAllUsers,
  registerUser,
  verifyOTP,
  deleteUser,
} from "../controllers/users.controller";
import catchAsync from "../helpers/catchAsync.helper";

const usersRouter = Router();

usersRouter.get("/all", catchAsync(getAllUsers));
usersRouter.post("/register", catchAsync(registerUser));
usersRouter.post("/verify", catchAsync(verifyOTP));
usersRouter.delete("/delete", catchAsync(deleteUser));

export default usersRouter;
