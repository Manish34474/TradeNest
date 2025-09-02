import crypto from "crypto";
import { Request, Response } from "express";
import productModel from "../models/product.model";
import deleteFromCloudinary from "../helpers/deleteFromCloudinary";
import validateFields from "../helpers/validateMissingFields.helper";
import uploadToCloudinary from "../helpers/uploadToCloudinary.helper";
import updateDocumentFields from "../helpers/updateDocumentFields.helper";
import cartItemModel from "../models/cartItem.model";
import orderItemModel from "../models/orderItem.model";

// extract email from request
function extractUserId(req: Request) {
  if (!req.userId) {
    throw new Error("User Id not found in request");
  }
  return req.userId;
}

// get all products
async function getAllProducts(req: Request, res: Response) {
  try {
    // pagination
    const page =
      typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit =
      typeof req.query.limit === "string" ? parseInt(req.query.limit) : 12;
    const skip = (page - 1) * limit;

    // fetch products with category and seller info
    const products = await productModel
      .find()
      .populate("productCategory", "categoryName") // optional: only needed fields
      .populate("seller", "username") // optional
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // total products count
    const totalProducts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    if (products.length === 0) {
      return res.status(204).json({
        products: [],
        message: "No products found",
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
      });
    }

    return res.status(200).json({
      products,
      currentPage: page,
      totalPages: totalPages,
      totalProducts: totalProducts,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! something went wrong. Try again",
    });
  }
}

// get my products (for seller)
async function getMyProducts(req: Request, res: Response) {
  try {
    const sellerId = extractUserId(req); // get logged in userId (seller)

    // pagination
    const page =
      typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit =
      typeof req.query.limit === "string" ? parseInt(req.query.limit) : 12;
    const skip = (page - 1) * limit;

    // fetch products created by this seller
    const products = await productModel
      .find({ seller: sellerId })
      .populate("productCategory", "categoryName")
      .populate("seller", "username") // you can also include email etc.
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // count total products of this seller
    const totalProducts = await productModel.countDocuments({ seller: sellerId });
    const totalPages = Math.ceil(totalProducts / limit);

    if (products.length === 0) {
      return res.status(204).json({
        products: [],
        message: "You have not added any products yet",
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
      });
    }

    return res.status(200).json({
      products,
      currentPage: page,
      totalPages: totalPages,
      totalProducts: totalProducts,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! something went wrong. Try again",
    });
  }
}

// create product
async function createProduct(req: Request, res: Response) {
  const uid = extractUserId(req);

  // get fields from body
  const {
    productName,
    alt,
    description,
    productCategory,
    specifications,
    price,
    discount,
    stock,
  } = req.body;

  // validate missing fields
  const hasError = validateFields(
    {
      productName,
      alt,
      description,
      productCategory,
      specifications,
      price,
      stock,
    },
    res
  );
  if (hasError) return;

  if (stock <= 0) {
    return res
      .status(400)
      .json({ message: "Stock cannot be less than or equal to 0" });
  }

  // normalize slug
  const normalizedSlug = productName.trim().toLowerCase().replace(/\s+/g, "-");

  // calculate actual price if discount available
  const effectiveDiscount = discount !== undefined ? discount : 0;
  const actualPrice = Math.floor(price - (effectiveDiscount / 100) * price);

  try {
    // check duplicate product
    const duplicate = await productModel
      .findOne({ slug: normalizedSlug })
      .exec();
    if (duplicate) {
      return res.status(409).json({ message: "Product already exists" });
    }

    // upload image
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }
    const public_id = crypto.randomBytes(10).toString("hex");
    const imageURL = await uploadToCloudinary(req.file.buffer, public_id);

    // parse specifications (expecting array of strings: ["Power: 10W", "Capacity: 200L"])
    let parsedSpecs;
    try {
      parsedSpecs =
        typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications;
      if (
        !Array.isArray(parsedSpecs) ||
        !parsedSpecs.every((s) => typeof s === "string")
      ) {
        return res
          .status(400)
          .json({ message: "Specifications must be an array of strings" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid specifications format" });
    }

    // create product
    await productModel.create({
      image: {
        imageURL,
        public_id,
      },
      alt,
      productName,
      slug: normalizedSlug,
      productCategory,
      seller: uid,
      description,
      specifications: parsedSpecs, // array of strings
      price,
      discount: effectiveDiscount,
      actualPrice,
      stock,
    });

    return res
      .status(201)
      .json({ message: "New product created successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!! something went wrong. Try Again.",
    });
  }
}

// update product
async function updateProduct(req: Request, res: Response) {
  const {
    id,
    alt,
    productName,
    description,
    productCategory,
    specifications,
    price,
    discount,
    stock,
  } = req.body;

  // validate missing fields
  const hasError = validateFields({ id }, res);
  if (hasError) return;

  // find product in database
  const product = await productModel.findOne({ _id: id }).exec();
  if (!product) return res.status(204).json({ message: "Product not found" });

  try {
    // upload new image if provided
    if (req.file) {
      const public_id = crypto.randomBytes(10).toString("hex");
      const imageURL = await uploadToCloudinary(req.file.buffer, public_id);

      product.image = { imageURL, public_id };
    }

    // update slug if productName changes
    if (productName) {
      const normalizedSlug = productName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

      const existingProduct = await productModel.findOne({
        slug: normalizedSlug,
        _id: { $ne: id },
      });

      if (existingProduct) {
        return res
          .status(409)
          .json({ message: "Product with this slug already exists" });
      }

      product.slug = normalizedSlug;
    }

    // handle specifications (array of strings)
    let parsedSpecs = undefined;
    if (specifications) {
      try {
        parsedSpecs =
          typeof specifications === "string"
            ? JSON.parse(specifications)
            : specifications;

        if (
          !Array.isArray(parsedSpecs) ||
          !parsedSpecs.every((s) => typeof s === "string")
        ) {
          return res
            .status(400)
            .json({ message: "Specifications must be an array of strings" });
        }

        product.specifications = parsedSpecs;
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Invalid specifications format" });
      }
    }

    // update other fields
    updateDocumentFields(product, {
      alt,
      productName,
      description,
      productCategory,
      discount,
      price,
      stock,
    });

    // calculate actual price if discount or price is updated
    if (price !== undefined || discount !== undefined) {
      const effectivePrice = price !== undefined ? price : product.price;
      const effectiveDiscount =
        discount !== undefined ? discount : product.discount;

      product.actualPrice = Math.floor(
        effectivePrice - (effectiveDiscount / 100) * effectivePrice
      );
    }

    await product.save();

    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! something went wrong. Try again",
    });
  }
}

// delete product
async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  // validate missing fields
  const hasError = validateFields({ id }, res);
  if (hasError) return;

  // check if product exists
  const product = await productModel.findOne({ _id: id }).exec();
  if (!product) return res.status(204).json({ message: "Product not found" });

  const cartItem = await cartItemModel.findOne({ productId: id }).exec();
  if (cartItem) return res.status(400).json({ message: "Cannot delete item, as it already exists in a cart" })

  const orderItem = await orderItemModel.findOne({ productId: id }).exec();
  if (orderItem) return res.status(400).json({ message: "Cannot delete item, as it already exists in a order" })

  try {
    // delete product image from cloudinary (if exists)
    if (product.image?.public_id) {
      await deleteFromCloudinary(product.image.public_id);
    }

    // delete product from db
    await productModel.deleteOne({ _id: id });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! something went wrong. Try again",
    });
  }
}

// get one product
async function getProduct(req: Request, res: Response) {
  const { slug } = req.params;

  // validate missing fields
  const hasError = validateFields({ slug }, res);
  if (hasError) return;

  try {
    const product = await productModel
      .findOne({ slug })
      .populate("productCategory", "categoryName slug")
      .populate("seller", "username")
      .exec();

    if (!product) return res.status(204).json({ message: "Product not found" });

    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! something went wrong. Try again",
    });
  }
}

export {
  getAllProducts,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
};
