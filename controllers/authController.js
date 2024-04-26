import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  const { name, email, password, address, phone, answer } = req.body;

  if (!name) {
    return res.send({ message: "Name is required" });
  }
  if (!email) {
    return res.send({ message: "email is required" });
  }
  if (!password) {
    return res.send({ message: "password is required" });
  }
  if (!address) {
    return res.send({ message: "address is required" });
  }
  if (!phone) {
    return res.send({ message: "phone is required" });
  }
  if (!answer) {
    return res.send({ message: "answer is required" });
  }
  // checking user
  const existingUser = await userModel.findOne({ email });
  //existingUser
  if (existingUser) {
    return res.status(200).send({
      success: false,
      message: "Already register please Login",
    });
  }
  // registering user
  const hashedPassword = await hashPassword(password);
  // save
  const user = await new userModel({
    name,
    email,
    phone,
    address,
    password: hashedPassword,
    answer,
  }).save();

  res.status(201).send({
    success: true,
    message: "registraion successfully",
    user,
  });
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(404).send({
        success: false,
        message: "Invalid email or Password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not register",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      },
      token,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      res.status(400).send('Email is required')
    }
    if (!answer) {
      res.status(400).send('answer is required')
    }
    if (!newPassword) {
      res.status(400).send('newPassword is required')
    }

    const user = await userModel.findOne({ email, answer })

    if (!user) {
      res.status(404).send({
        success: false,
        message: 'Wrong email or answer'
      })
    }

    const hashed = await hashPassword(newPassword);

    await userModel.findByIdAndUpdate(user._id, { password: hashed })
    res.status(200).send({
      success: true,
      message: 'Password Reset Successfully'
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Something went Wrong'
    })
  }
}

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body
    const user = await userModel.findById(req.user._id)
    // password
    if (password && password.length < 6) {
      return res.json({ error: 'Password is required and 6 Character Long' })
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
      name: name || user.name,
      password: hashedPassword || user.password,
      phone: phone || user.phone,
      address: address || user.address
    }, { new: true })

    res.status(200).send({
      success: true,
      message: " Updated succesFully",
      updatedUser
    })
  } catch (error) {
    console.log(error)
    res.statue(400).send({
      success: false,
      message: " Error while updating Profile"
    })
  }
}

// getting orders
export const getOrderController = async (req, res) => {
  try {
    const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error
    })
  }
}

// getting All orders
export const getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" })
    res.json(orders);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error
    })
  }
}

// orderStatus Controller

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in updating OrderStatus"
    })
  }
}