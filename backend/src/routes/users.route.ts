import { Router } from "express";
import {
  getAllUsers,
  registerUser,
  verifyOTP,
  deleteUser,
  updateProfile,
} from "../controllers/users.controller";
import catchAsync from "../helpers/catchAsync.helper";
import { verifyJWT } from "../middlewares/verifyJWT.middlware";
import verifyRoles from "../middlewares/verifyRoles.middleware";
import rolesList from "../config/roleList.config";

const usersRouter = Router();

usersRouter.get("/all", catchAsync(getAllUsers));
usersRouter.post("/register", catchAsync(registerUser));
usersRouter.post("/verify", catchAsync(verifyOTP));
usersRouter.put("/profile", verifyJWT, catchAsync(updateProfile));
usersRouter.delete("/delete", verifyJWT, catchAsync(deleteUser));

export default usersRouter;
