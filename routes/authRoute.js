import express from "express";
import {
  forgotPasswordController,
  getAllOrderController,
  getOrderController,
  loginController,
  orderStatusController,
  registerController,
  testController,
  updateProfileController
} from "../controllers/authController.js";
import {requireSignIn,isAdmin} from '../middlewares/authMiddlewares.js'

// router object
const router = express.Router();

// routing || register
router.post("/register", registerController);

// routing || login
router.post("/login", loginController);

// routing ||  forgot password
router.post('/forgot-password', forgotPasswordController)

router.get("/test", requireSignIn, isAdmin, testController);

// Dashboard - User
router.get('/user-auth' , requireSignIn ,(req,res)=>{
  res.status(200).send({ok:true})
}) 

// Dashboard - Admin
router.get('/admin-auth' , requireSignIn , isAdmin, (req,res)=>{
  res.status(200).send({ok:true})
})

// update profile
router.put('/profile', requireSignIn , updateProfileController)

//Orders
router.get('/orders' , requireSignIn , getOrderController)

//All Orders
router.get('/all-orders' , requireSignIn ,isAdmin, getAllOrderController)

// order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

export default router;