import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddlewares.js'
import { createCategoryController, deleteCategoryController, getCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js'

const router = express.Router()

// Create Category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

// update category
router.put('/update-category/:id', requireSignIn , isAdmin , updateCategoryController)

// get category 
router.get('/get-category', getCategoryController)

// get single category 
router.get("/single-category/:slug" , singleCategoryController)

//delete category
router.delete('/delete-category/:id', requireSignIn, isAdmin , deleteCategoryController)

export default router