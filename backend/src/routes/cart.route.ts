import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} from "../controllers/cart.controller";
import catchAsync from "../helpers/catchAsync.helper";
import { verifyJWT } from "../middlewares/verifyJWT.middlware";

const cartRouter = Router();

cartRouter.get("/all", verifyJWT, catchAsync(getCart));
cartRouter.post("/add", verifyJWT, catchAsync(addToCart));
cartRouter.put("/update", verifyJWT, catchAsync(updateCart));
cartRouter.delete("/delete", verifyJWT, catchAsync(removeFromCart));

export default cartRouter;
