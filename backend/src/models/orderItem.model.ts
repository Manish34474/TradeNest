import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      require: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    totalPrice: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const orderItemModel = mongoose.model("OrderItem", orderItemSchema);

export default orderItemModel;
