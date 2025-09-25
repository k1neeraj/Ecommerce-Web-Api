const mongoose = require("mongoose");

// Subschema for order items
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  }
});

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      type: orderItemSchema,
      required: true,
    },
  ],
  shippingAddress1: {
    type: String,
    required: true,
  },
  shippingAddress2: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  }
});

// Virtual for id (for frontend and API consistency)
orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
orderSchema.set("toJSON", {
  virtuals: true,
});

// Exports
exports.Order = mongoose.model("Order", orderSchema);
