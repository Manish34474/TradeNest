import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} from "../controllers/product.controller";
import catchAsync from "../helpers/catchAsync.helper";
import { upload } from "../middlewares/multer.middleware";

const productRouter = Router();

productRouter.get("/all", catchAsync(getAllProducts));
productRouter.post(
  "/create",
  upload.single("image"),
  catchAsync(createProduct)
);
productRouter.put("/update", upload.single("image"), catchAsync(updateProduct));
productRouter.delete("/delete", catchAsync(deleteProduct));
productRouter.get("/:slug", catchAsync(getProduct));

export default productRouter;
