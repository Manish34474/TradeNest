import { Response, Request } from "express";
import cartModel from "../models/cart.model";
import cartItemModel from "../models/cartItem.model";
import orderModel from "../models/order.model";
import orderItemModel from "../models/orderItem.model";
import validateFields from "../helpers/validateMissingFields.helper";

// extract email from request
function extractUserId(req: Request) {
  if (!req.userId) {
    throw new Error("User Id not found in request");
  }
  return req.userId;
}

// place order from cart
async function placeOrderFromCart(req: Request, res: Response) {
  // get user id from request
  const userId = extractUserId(req);

  // get other details from body
  const { address, phoneNumber, paymentMethod } = req.body;

  // validate missing fields
  const hasError = validateFields({ address, phoneNumber, paymentMethod }, res);
  if (hasError) return;

  try {
    // get user cart with product info
    const cart = await cartModel.findOne({ userId }).populate({
      path: "cartItem",
      populate: {
        path: "productId",
        select: "actualPrice",
      },
    });

    if (!cart || cart.cartItem.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Create OrderItems from cartItems
    let orderItems: any[] = [];
    let totalAmount = 0;

    console.log(cart.cartItem);

    for (const item of cart.cartItem as any) {
      const orderItem = new orderItemModel({
        orderId: null,
        productId: item.productId._id,
        quantity: item.quantity,
        totalPrice: item.quantity * item.productId.actualPrice,
      });

      await orderItem.save();
      orderItems.push(orderItem._id);
      totalAmount += Number(orderItem.totalPrice);
    }

    // Create the Order
    const order = new orderModel({
      userId,
      orderItems,
      totalAmount,
      address,
      phone: phoneNumber,
      orderStatus: paymentMethod === "Cash" ? "Processing" : "Pending",
      paymentStatus: paymentMethod === "Cash" ? "Pending" : "Paid",
      paymentMethod: paymentMethod,
    });

    await order.save();

    // Link OrderItems to this Order
    await orderItemModel.updateMany(
      { _id: { $in: orderItems } },
      { orderId: order._id }
    );

    // Clear the cart
    await cartItemModel.deleteMany({ cartId: cart._id });
    cart.cartItem = [];
    await cart.save();

    return res.status(201).json({
      message:
        paymentMethod === "cash"
          ? "Order placed successfully. Pay in cash upon delivery."
          : "Order placed successfully. Awaiting payment confirmation.",
      orderId: order._id,
      totalAmount,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! Something went wrong. Try again",
    });
  }
}

// get order
async function getMyOrders(req: Request, res: Response) {
  // extract user id from request
  const userId = extractUserId(req);

  // page number and limit for pagination
  const page =
    typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
  const limit =
    typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
  const skip = (page - 1) * limit;

  try {
    // find order
    const order = await orderModel.find({ userId: userId }).populate({
      path: "orderItems",
      populate: {
        path: "productId",
        populate: [
          {
            path: "productCategory",
            select: "categoryName",
          },
          {
            path: "seller",
            select: "username",
          },
        ],
      },
    });

    // if order is empty
    if (!order) {
      return res
        .status(200)
        .json({ message: "Looks like you haven't placed an order yet" });
    }

    res.status(200).json({ order: order });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!! something went wrong. Try Again.",
    });
  }
}

export { placeOrderFromCart, getMyOrders };
