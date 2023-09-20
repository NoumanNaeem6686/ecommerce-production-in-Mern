import slugify from "slugify";
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import Order from "../models/OrderModel.js";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

/////Payment gateway ..///
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MARCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (request, response) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      request.fields;
    const { photo } = request.files;

    /// Validation ..///
    switch (true) {
      case !name:
        response.status(500).send({ message: "name is required" });
        break;
      case !description:
        response.status(500).send({ message: "description is required" });
        break;
      case !price:
        response.status(500).send({ message: "price is required" });
        break;
      case !category:
        response.status(500).send({ message: "category is required" });
        break;
      case !quantity:
        response.status(500).send({ message: "quantity is required" });
        break;
      case photo && photo.size > 1000000:
        response
          .status(500)
          .send({ message: "pictire size should be less than 1MB" });
        break;
    }
    const products = new Product({ ...request.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    response.status(201).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error while calling createProduct controller",
      error,
    });
  }
};

//// getting alll products ..///
export const getProductController = async (request, response) => {
  try {
    const product = await Product.find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    response.status(200).send({
      success: true,
      totalProducts: product.length,
      message: "all Product fetched successfully ",
      product,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error in getproduct controller",
      error,
    });
  }
};

///// getting single product without photo ..///
export const getSingleProductController = async (request, response) => {
  try {
    const product = await Product.findOne({ slug: request.params.slug })
      .select("-photo")
      .populate("category");
    response.status(200).send({
      success: true,
      message: "Get Single Product successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error while calling single product controller",
      error,
    });
  }
};

///// getting photo /.//
export const getProductPhoto = async (request, response) => {
  try {
    const product = await Product.findById(request.params.pid).select("photo");
    if (product.photo.data) {
      response.set("Content-type", product.photo.contentType);
      return response.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: true,
      message: "Error in get photo api",
    });
  }
};

//// Delete product controller ..//
export const deleteProductController = async (request, response) => {
  try {
    await Product.findByIdAndDelete(request.params.pid).select("-photo");
    response.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error in delete product Api",
      error,
    });
  }
};

/// Update Product ..//
export const updateProductController = async (request, response) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      request.fields;
    const { photo } = request.files;

    /// Validation ..///
    switch (true) {
      case !name:
        response.status(500).send({ message: "name is required" });
        break;
      case !description:
        response.status(500).send({ message: "description is required" });
        break;
      case !price:
        response.status(500).send({ message: "price is required" });
        break;
      case !category:
        response.status(500).send({ message: "category is required" });
        break;
      case !quantity:
        response.status(500).send({ message: "quantity is required" });
        break;
      case photo && photo.size > 1000000:
        response
          .status(500)
          .send({ message: "pictire size should be less than 1MB" });
        break;
    }
    const products = await Product.findByIdAndUpdate(
      request.params.pid,
      { ...request.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    response.status(201).send({
      success: true,
      message: "Product updated successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error while calling Update product controller",
      error,
    });
  }
};

/// Product filter controller ../
export const productFilterController = async (request, response) => {
  try {
    const { checked, radio } = request.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Product.find(args);
    response.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    response.status(400).send({
      success: false,
      message: "Error in Product filter controller",
      error,
    });
  }
};

///// product count controller ..//
export const productCountController = async (request, response) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    response.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error while calling product count controller",
      error,
    });
  }
};

//////..Product list controller ..//
export const productListController = async (request, response) => {
  try {
    const perpage = 3;
    const page = request.params.page ? request.params.page : 1;
    const products = await Product.find({})
      .select("-photo")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .sort({ createdAt: -1 });
    response.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error while calling product list controller",
      error,
    });
  }
};

/// search product controller ..//
export const searchProductController = async (request, response) => {
  try {
    const { keyword } = request.params;
    const results = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    response.status(200).json(results);
  } catch (error) {
    response.status(500).send({
      success: false,
      message: "Error in search poduct controller",
      error,
    });
  }
};

///// Similer product controller ../
export const relatedProductController = async (request, response) => {
  try {
    const { pid, cid } = request.params;
    const products = await Product.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(3)
      .populate("category");
    response.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error in similer product controller",
      error,
    });
  }
};

//// get product by category..///
export const productCategoryController = async (request, response) => {
  try {
    const category = await Category.findOne({ slug: request.params.slug });
    const products = await Product.find({ category }).populate("category");
    response.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error while calling product category controller",
      error,
    });
  }
};

//// braintree token controler .///
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        // console.log(response);
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//// payment controller ..//
export const brainTreePaymentController = async (request, response) => {
  try {
    const { cart, nonce } = request.body;
    let total = 0;
    cart.map((item) => {
      total += item.price;
    });
    let newTransection = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new Order({
            products: cart,
            payment: result,
            buyer: request.user._id,
          }).save();
          response.json({ ok: true });
        } else {
          response.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
