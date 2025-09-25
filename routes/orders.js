const { Order } = require("../models/order");
const express = require("express");
const router = express.Router();

// CREATE a new order
router.post("/", async (req, res) => {
  try {
    let order = new Order({
      orderItems: req.body.orderItems,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user,
    });
    order = await order.save();
    if (!order) {
      return res.status(400).json({ success: false, message: "Order cannot be created" });
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orderList = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price");
    if (!orderList || orderList.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }
    res.status(200).json(orderList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE order status by ID
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found or could not be updated" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all orders by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const orderList = await Order.find({ user: req.params.userId })
      .populate("user", "name email")
      .populate("orderItems.product", "name price");
    if (!orderList || orderList.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this user" });
    }
    res.status(200).json(orderList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
