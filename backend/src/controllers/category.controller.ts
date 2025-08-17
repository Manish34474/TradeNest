import { Request, Response } from "express";
import crypto from "crypto";
import categoryModel from "../models/category.model";
import validateFields from "../helpers/validateMissingFields.helper";
import uploadToCloudinary from "../helpers/uploadToCloudinary.helper";
import updateDocumentFields from "../helpers/updateDocumentFields.helper";
import deleteFromCloudinary from "../helpers/deleteFromCloudinary";

// get all categories
async function getAllCategories(req: Request, res: Response) {
  // page number and limit for pagination
  const page =
    typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
  const limit =
    typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;
  const skip = (page - 1) * limit;

  // find categories in database
  const categories = await categoryModel
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // if no categories found
  if (categories.length === 0) {
    return res.status(204).json({
      categories: [],
      message: "No categories found",
      currentPage: page,
      totalPages: 0,
      totalUsers: 0,
    });
  }

  // if categories found
  const totalCategories = await categoryModel.countDocuments();
  const totalPages = Math.ceil(totalCategories / limit);

  return res.status(200).json({
    categories,
    currentPage: page,
    totalPages: totalPages,
    totalCategories: totalCategories,
  });
}

// create category
async function createCategory(req: Request, res: Response) {
  // get category name from body
  const { categoryName, alt } = req.body;

  // validate missing fields
  const hasError = validateFields({ categoryName, alt }, res);
  if (hasError) return;

  // normalize slug
  const normalizedSlug = categoryName.trim().toLowerCase().replace(/\s+/g, "-");

  try {
    // checking for duplicate entries
    const duplicate = await categoryModel
      .findOne({ slug: normalizedSlug })
      .exec();
    if (duplicate) {
      return res.status(409).json({ message: "Category already exists" });
    }

    // upload image to cloudinary
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }
    const public_id = crypto.randomBytes(10).toString("hex");
    const imageURL = await uploadToCloudinary(req.file.buffer, public_id);

    // create category
    await categoryModel.create({
      image: {
        imageURL,
        public_id,
      },
      alt,
      categoryName,
      slug: normalizedSlug,
    });

    return res
      .status(201)
      .json({ message: "New category created successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!! something went wrong. Try Again.",
    });
  }
}

// update category
async function updateCategory(req: Request, res: Response) {
  const { id, alt, categoryName } = req.body;

  //   validate missing fields
  const hasError = validateFields({ id }, res);
  if (hasError) return;

  //   find category in database
  const category = await categoryModel.findOne({ _id: id }).exec();
  if (!category) return res.status(204).json({ message: "Category not found" });

  // update category
  try {
    // upload image to cloudinary
    if (req.file) {
      const public_id = crypto.randomBytes(10).toString("hex");
      const imageURL = await uploadToCloudinary(req.file.buffer, public_id);

      category.image = { imageURL, public_id };
    }

    if (categoryName) {
      const normalizedSlug = categoryName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

      const existingCategory = await categoryModel.findOne({
        slug: normalizedSlug,
        _id: { $ne: id },
      });

      if (existingCategory) {
        return res
          .status(409)
          .json({ message: "Blog with this slug already exists" });
      }

      category.slug = normalizedSlug;
    }

    updateDocumentFields(category, {
      alt,
      categoryName,
    });

    await category.save();

    return res.status(200).json({ message: "Category updated successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! something went wrong. Try again",
    });
  }
}

// delete category
async function deleteCategory(req: Request, res: Response) {
  const { id } = req.body;

  //   validate missing fields
  const hasError = validateFields({ id }, res);
  if (hasError) return;

  // validate if category exists
  const category = await categoryModel.findById(id).exec();
  if (!category) return res.status(204).json({ message: "Category not found" });

  // delete category
  try {
    if (category.image?.public_id) {
      await deleteFromCloudinary(category.image.public_id);
    }

    await category.deleteOne({ _id: id });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!!! somthing went wrong. Try again",
    });
  }
}

// get one category
async function getCategory(req: Request, res: Response) {
  const { slug } = req.params;

  //   validate missing fields
  const hasError = validateFields({ slug }, res);
  if (hasError) return;

  // get one category
  try {
    const category = await categoryModel.findOne({ slug }).exec();

    if (!category)
      return res.status(204).json({ message: "Category not found" });

    return res.status(200).json(category);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Opps!!! something went wrong. Try again",
    });
  }
}

export {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
};
