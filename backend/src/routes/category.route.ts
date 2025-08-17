import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} from "../controllers/category.controller";
import catchAsync from "../helpers/catchAsync.helper";
import { upload } from "../middlewares/multer.middleware";

const categoryRouter = Router();

categoryRouter.get("/all", catchAsync(getAllCategories));
categoryRouter.post(
  "/create",
  upload.single("image"),
  catchAsync(createCategory)
);
categoryRouter.put(
  "/update",
  upload.single("image"),
  catchAsync(updateCategory)
);
categoryRouter.delete("/delete", catchAsync(deleteCategory));
categoryRouter.get("/:slug", catchAsync(getCategory));

export default categoryRouter;
