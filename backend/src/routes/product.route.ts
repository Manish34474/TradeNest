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
import { verifyJWT } from "../middlewares/verifyJWT.middlware";
import verifyRoles from "../middlewares/verifyRoles.middleware";
import rolesList from "../config/roleList.config";

const productRouter = Router();

productRouter.get("/all", catchAsync(getAllProducts));
productRouter.post(
  "/create",
  verifyJWT,
  verifyRoles(rolesList.admin, rolesList.seller),
  upload.single("image"),
  catchAsync(createProduct)
);
productRouter.put(
  "/update",
  verifyJWT,
  verifyRoles(rolesList.admin, rolesList.seller),
  upload.single("image"),
  catchAsync(updateProduct)
);
productRouter.delete(
  "/delete",
  verifyJWT,
  verifyRoles(rolesList.admin, rolesList.seller),
  catchAsync(deleteProduct)
);
productRouter.get("/:slug", catchAsync(getProduct));

export default productRouter;
