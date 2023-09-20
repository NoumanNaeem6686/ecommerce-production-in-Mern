import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  testController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusUpdateController
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

///router object//..//
const router = express.Router();

///Routing.//

///Register || Method : Post
router.post("/register", registerController);

///Login || Method POST

router.post("/login", loginController);

/// Forget Password || Method Post ..////
router.post('/forget-password', forgotPasswordController)

///test route ..//
router.get("/test", requireSignIn, isAdmin, testController);

///protected user Route ..//
router.post('/user-auth', requireSignIn, (request, response)=>{
response.status(200).send({ok : true});
})

////Protected Admin Route  ..///
router.post('/admin-auth', requireSignIn, isAdmin , (request, response)=>{
  response.status(200).send({ok : true});
  })

  //// profile update ..////
  router.put('/profile', requireSignIn, updateProfileController)

  /// orders route ...//
  router.get('/orders', requireSignIn , getOrdersController)

  /// getting all orders ...//
  router.get('/all-orders', requireSignIn, isAdmin , getAllOrdersController);

  //// order status update route ../
  router.put('/order-status/:orderId', requireSignIn, isAdmin , orderStatusUpdateController)

export default router;
