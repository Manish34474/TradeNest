import { Router } from "express";
import {
  placeOrderFromCart,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller";
import catchAsync from "../helpers/catchAsync.helper";
import { verifyJWT } from "../middlewares/verifyJWT.middlware";

const orderRoute = Router();

orderRoute.get("/myorders", verifyJWT, catchAsync(getMyOrders));
orderRoute.get("/orders", verifyJWT, catchAsync(getSellerOrders));
orderRoute.post("/place", verifyJWT, catchAsync(placeOrderFromCart));
orderRoute.put("/update", verifyJWT, catchAsync(updateOrderStatus));
orderRoute.delete("/delete/:orderId", verifyJWT, catchAsync(deleteOrder));

export default orderRoute;
