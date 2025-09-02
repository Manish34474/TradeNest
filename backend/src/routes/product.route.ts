import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getMyProducts,
} from "../controllers/product.controller";
import catchAsync from "../helpers/catchAsync.helper";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/verifyJWT.middlware";
import verifyRoles from "../middlewares/verifyRoles.middleware";
import rolesList from "../config/roleList.config";

const productRouter = Router();

productRouter.get("/all", verifyJWT, catchAsync(getAllProducts));
productRouter.get("/myproducts", verifyJWT, verifyRoles(rolesList.seller), catchAsync(getMyProducts));
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
  "/delete/:id",
  verifyJWT,
  verifyRoles(rolesList.admin, rolesList.seller),
  catchAsync(deleteProduct)
);
productRouter.get("/:slug", verifyJWT, catchAsync(getProduct));

export default productRouter;
