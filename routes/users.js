const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// GET all users (passwordHash omitted)
router.get("/", async (req, res) => {
  try {
    const userList = await User.find().select("-passwordHash");
    if (!userList || userList.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a user by id (passwordHash omitted)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ success: false, message: "The user with the given ID was not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE a user
router.post("/", async (req, res) => {
  try {
    // Simple validation - we can add more fields as needed
    if (!req.body.password || !req.body.email || !req.body.name) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();
    if (!user) {
      return res.status(400).json({ success: false, message: "The user cannot be created!" });
    }
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
