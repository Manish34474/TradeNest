import { Router } from "express";
import {
  handleLogin,
  handleRefresh,
  handleLogout,
} from "../controllers/auth.controller";
import catchAsync from "../helpers/catchAsync.helper";

const authRouter = Router();

authRouter.post("/login", catchAsync(handleLogin));
authRouter.get("/refresh", catchAsync(handleRefresh));
authRouter.post("/logout", catchAsync(handleLogout));

export default authRouter;
