import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "products",
      },
    ],
    payment: [],
    buyer: {
      type: mongoose.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum: ["Not Process", "Processing", "Shipped", "delivered", "Cancle"],
      trim: true,
      default: "Not Process",
    },
  },
  { timestamps: true }
);

const order = mongoose.model("order", orderSchema);
export default order;
