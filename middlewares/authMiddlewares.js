import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const token = req.headers.authorization
    const decode = JWT.verify(token, process.env.JWT_SECRETKEY);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};