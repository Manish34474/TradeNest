import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    image: {
      imageURL: {
        type: String,
        require: true,
      },
      public_id: {
        type: String,
        require: true,
      },
    },
    alt: {
      type: String,
      require: true,
    },
    productName: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      require: true,
    },
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    specifications: {
      type: [String],
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    discount: {
      type: Number,
    },
    actualPrice: {
      type: Number,
    },
    stock: {
      type: Number,
      require: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
