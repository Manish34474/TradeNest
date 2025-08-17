import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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
    categoryName: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
