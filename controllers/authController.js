import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import User from "../models/userModel.js";
import Order from "../models/OrderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (request, response) => {
  try {
    const { name, email, password, phone, answer, address } = request.body;
    console.log(request.body);

    /////Validation//...///

    if (!name) {
      return response.send({ message: "Name is required" });
    }
    if (!email) {
      return response.send({ message: "Email is required" });
    }
    if (!password) {
      return response.send({ message: "Password is required" });
    }
    if (!phone) {
      return response.send({ emessage: "Phone no is required" });
    }
    if (!address) {
      return response.send({ message: "Address is required" });
    }
    if (!answer) {
      return response.send({ message: "answer is required" });
    }

    ////checking user..///

    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    //..//// checking existing User..///

    if (existingUser) {
      return response.status(200).send({
        success: false,
        message: "Already exists please Login",
      });
    }

    //// register User..//

    const hashedPassword = await hashPassword(password);

    ////save user..///
    const user = await new User({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    });
    user.save();
    return response.status(201).send({
      success: true,
      message: "User register successfully",
      user,
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: "Error in Regestration",
      error,
    });
  }
};

/////POST || Login ///

export const loginController = async (request, response) => {
  try {
    const { email, password } = request.body;

    ////validation //..//
    if (!email || !password) {
      return response.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    ///check User ..//
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).send({
        success: false,
        message: "Email is not register",
      });
    }

    //// compareing password   /////

    const match = await comparePassword(password, user.password);
    if (!match) {
      return response.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //// creating Tokken ..////

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    response.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Login Failed",
      error,
    });
  }
};

////// Forgot Password Controller ...///
export const forgotPasswordController = async (request, response) => {
  try {
    const { email, answer, password } = request.body;
    console.log(request.body);
    if (!request.body.email) {
      response.status(400).send({ message: "Email is required!" });
    }
    if (!request.body.answer) {
      response.status(400).send({ message: "Answer is required!" });
    }
    if (!request.body.password) {
      response.status(400).send({ message: "New Password is required!" });
    }

    //// checking user from database ..//
    const user = await User.findOne({ email });
    console.log(user);

    ////validation ..///
    if (!user) {
      response.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(password);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    response.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Something went wrong is forgetpassword Api",
      error,
    });
  }
};

////test controller ..///
export const testController = (request, response) => {
  response.send("Protected Route");
};

///// Update profile controller .../
export const updateProfileController = async (request, response) => {
  try {
    const { name, email, password, address, phone } = request.body;
    console.log(request.body.name);
    const user = await User.findById(request.user._id);
    ///pasword ..//
    if (password && password?.length < 6) {
      return response.json({
        message: "Password is required and 6 character long",
      });
    }

    const hashedpassword = password ? await hashPassword(password) : undefined;

    const updateUser = await User.findByIdAndUpdate(
      request.user._id,
      {
        name: name || user.name,
        password: hashedpassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    response.status(200).send({
      success: true,
      message: "user updated successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error in profile update controller",
      error,
    });
  }
};

//////  orders controller ....///
export const getOrdersController = async (request, response) => {
  try {
    const order = await Order.find({ buyer: request.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    response.json(order);
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error while calling get order controller api",
      error,
    });
  }
};

/// gettiing all orders for admin use ...//
export const getAllOrdersController = async (request, response) => {
  try {
    const order = await Order.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
      response.json(order);
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error in get all order controller",
      error,
    });
  }
};

/// order status update controller ..//
export const orderStatusUpdateController = async(request, response)=>{
  try{
const {orderId} = request.params;
const {status} = request.body;
const order = await Order.findByIdAndUpdate(orderId , {status} , {new : true});
response.status(200).send({
  success : true,
  message : 'Status updated successfully',
  order
})
  }
  catch(error){
    console.log(error);
    response.status(500).send({
      success: false,
      message : 'Error while calling status update controller',
      error
    })
  }
}
