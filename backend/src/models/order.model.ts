import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        require: true,
      },
    ],
    totalAmount: {
      type: Number,
      require: true,
      default: 0,
    },
    address: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
      require: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "Cash"],
      default: "Cash On Delivery",
    },
    currency: {
      type: String,
      default: "GBP",
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
