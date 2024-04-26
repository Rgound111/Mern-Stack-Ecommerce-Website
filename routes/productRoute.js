import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddlewares.js';
import {
    createProductController,
    deleteProductController,
    filterProductController,
    getProductController,
    getṢingleProductController,
    productCategoryController,
    productCountController,
    productListController,
    productPhotoController,
    relatedProductController,
    searchProductController,
    updateProductController
} from '../controllers/productController.js';
import formidable from 'express-formidable'

const router = express.Router();

// create-product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

// update-product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

//Get Products
router.get("/get-product", getProductController)

//Get single Products
router.get("/get-product/:slug", getṢingleProductController)

//Get product photo
router.get("/product-photo/:pid", productPhotoController)

//Delete product photo
router.delete("/delete-product/:pid", deleteProductController)

//filter product
router.post("/product-filters", filterProductController)

// product count
router.get('/product-count', productCountController)

// product per page
router.get('/product-list/:page', productListController)

// Search Product
router.get('/search/:keyword', searchProductController)

//similar Product
router.get('/related-product/:pid/:cid', relatedProductController)

//Get category product
router.get('/product-category/:slug', productCategoryController)

export default router;