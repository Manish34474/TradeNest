import { Response, Request } from "express";
import cartModel from "../models/cart.model";
import cartItemModel from "../models/cartItem.model";
import orderModel from "../models/order.model";
import orderItemModel from "../models/orderItem.model";
import validateFields from "../helpers/validateMissingFields.helper";
import updateDocumentFields from "../helpers/updateDocumentFields.helper";
import userModel from "../models/user.model";
import productModel from "../models/product.model";

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
        paymentMethod === "Cash"
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

// get seller orders
async function getSellerOrders(req: Request, res: Response) {
  // get user id from request
  const userId = extractUserId(req);

  // page number and limit for pagination
  const page =
    typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
  const limit =
    typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
  const skip = (page - 1) * limit;

  try {
    const orders = await orderModel
      .find({
        "orderItems.productId": { $ne: null },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "username email",
      })
      .populate({
        path: "orderItems",
        populate: {
          path: "productId",
          match: { seller: userId },
          populate: [
            {
              path: "productCategory",
              select: "categoryName",
            },
            {
              path: "seller",
              select: "username email",
            },
          ],
        },
      });

    // // filter out orders that don’t contain any of this seller’s products
    const filteredOrders = orders.filter((order) =>
      order.orderItems.some((item: any) => item.productId !== null)
    );

    if (orders.length === 0) {
      return res
        .status(200)
        .json({
          orders: [],
          message: "No orders found",
          currentPage: page,
          totalPages: 0,
          totalCategories: 0,
        });
    }

    let totalOrders = await orderModel.countDocuments();
    let totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      orders: filteredOrders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!! something went wrong. Try Again.",
    });
  }
}


// get seller orders
async function getAllOrders(req: Request, res: Response) {
  // page number and limit for pagination
  const page =
    typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
  const limit =
    typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
  const skip = (page - 1) * limit;

  try {
    const orders = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "username email",
      })
      .populate({
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
              select: "username email",
            },
          ],
        },
      });

    if (orders.length === 0) {
      return res
        .status(200)
        .json({
          orders: [],
          message: "No orders found",
          currentPage: page,
          totalPages: 0,
          totalCategories: 0,
        });
    }

    let totalOrders = await orderModel.countDocuments();
    let totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      orders: orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!! something went wrong. Try Again.",
    });
  }
}

// update order and payment status
async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { orderStatus, paymentStatus, orderId } = req.body;

    const hasError = validateFields({ orderId }, res);
    if (hasError) return;

    // find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // update allowed fields
    updateDocumentFields(order, { orderStatus, paymentStatus }, [
      "orderStatus",
      "paymentStatus",
    ]);

    await order.save();

    return res.status(200).json({ message: "Order updated successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!! Something went wrong. Try again.",
    });
  }
}

// delete order
async function deleteOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await orderModel.findByIdAndDelete(orderId);

    return res.status(200).json({
      message: "Order deleted successfully",
      deletedOrderId: orderId,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!! Something went wrong. Try again.",
    });
  }
}

// stats
async function getStats(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);

    if (!userId) {
      return res.status(400).json({ message: "User/Seller ID is required" });
    }

    const revenueAgg = await orderModel.aggregate([
      {
        $lookup: {
          from: "orderitems",
          localField: "orderItems",
          foreignField: "_id",
          as: "orderItems",
        },
      },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $match: { "product.seller": userId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$orderItems.totalPrice" },
        },
      },
    ]);

    const totalRevenue =
      revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    const totalActiveUsers = await userModel.countDocuments();

    const totalOrders = await orderModel.countDocuments({
      "orderItems.productId": { $ne: null },
    });

    const totalProducts = await productModel.countDocuments({
      seller: userId,
    });

    return res.status(200).json({
      totalRevenue,
      totalActiveUsers,
      totalOrders,
      totalProducts,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!! Something went wrong. Try again.",
    });
  }
}

export { placeOrderFromCart, getMyOrders, getSellerOrders, getAllOrders, updateOrderStatus, deleteOrder, getStats };
