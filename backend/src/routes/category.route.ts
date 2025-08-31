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
import { verifyJWT } from "../middlewares/verifyJWT.middlware";
import verifyRoles from "../middlewares/verifyRoles.middleware";
import rolesList from "../config/roleList.config";

const categoryRouter = Router();

categoryRouter.get("/all", verifyJWT, catchAsync(getAllCategories));
categoryRouter.post(
  "/create",
  verifyJWT,
  verifyRoles(rolesList.admin),
  upload.single("image"),
  catchAsync(createCategory)
);
categoryRouter.put(
  "/update",
  verifyJWT,
  verifyRoles(rolesList.admin),
  upload.single("image"),
  catchAsync(updateCategory)
);
categoryRouter.delete(
  "/delete/:id",
  verifyJWT,
  verifyRoles(rolesList.admin),
  catchAsync(deleteCategory)
);
categoryRouter.get("/:slug", verifyJWT, catchAsync(getCategory));

export default categoryRouter;
