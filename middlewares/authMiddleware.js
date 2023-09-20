import JWT from "jsonwebtoken";
import User from "../models/userModel.js";

//// protetect Routes on token bases ..///
export const requireSignIn = (request, response, next) => {
  try {
    const decode = JWT.verify(
      request.headers.authorization,
      process.env.JWT_SECRET
    );
    request.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

////// Admin access ..///
export const isAdmin = async (request, response, next) => {
  try {
    const user = await User.findById(request.user._id);
    if (user.role !== 1) {
      return response.status(401).send({
        success: false,
        message: "UnAuthorised Access",
      });
    }
     else {
      next();
    }
  } catch (error) {
    console.log(error);
    response.status(401).send({
      success: false,
      message: "Error in Admin middleware",
      error,
    });
  }
};
