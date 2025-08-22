import { Router } from "express";
import {
  placeOrderFromCart,
  getMyOrders,
} from "../controllers/order.controller";
import catchAsync from "../helpers/catchAsync.helper";
import { verifyJWT } from "../middlewares/verifyJWT.middlware";

const orderRoute = Router();

orderRoute.get("/all", verifyJWT, catchAsync(getMyOrders));
orderRoute.post("/place", verifyJWT, catchAsync(placeOrderFromCart));

export default orderRoute;
