import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  getProductController,
  getSingleProductController,
  getProductPhoto,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  braintreeTokenController,
  brainTreePaymentController
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

/// Routes ..//

///// create product ..//
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//// get all Product //../
router.get("/get-product", getProductController);

///// get single product  ...//
router.get("/get-product/:slug", getSingleProductController);

//// get photo of product ..//
router.get("/product-photo/:pid", getProductPhoto);

/// Delete product ..//
router.delete("/delete-product/:pid", deleteProductController);

/// Update Product ..//
router.put(
    "/update-product/:pid",
    requireSignIn,
    isAdmin,
    formidable(),
    updateProductController
  );

  //// Products Filter Route ..//
  router.post('/product-filter', productFilterController);

  //// Product Count ..///
  router.get('/product-count', productCountController);

  ///// Product per page ..//
  router.get('/product-list/:page',productListController);

  /// Search products ..//
  router.get('/search/:keyword', searchProductController);

  ////Similer Product ..//
  router.get('/related-product/:pid/:cid', relatedProductController)

  /// category wise product controller ,,..//
  router.get('/product-category/:slug' , productCategoryController)

                 //// Payments Route ..//
    //// payment token ..//
    router.get('/braintree/token', braintreeTokenController)

    /// Payment route..//
    router.post('/braintree/payment' , requireSignIn , brainTreePaymentController)

export default router;
