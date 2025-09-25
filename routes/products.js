const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const mongoose = require("mongoose");

// GET all products with optional category filtering
router.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const productList = await Product.find(filter).populate("category");
    if (!productList || productList.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }
    res.status(200).json(productList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE a product
router.post("/", async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });
    product = await product.save();
    if (!product) return res.status(500).send("The product cannot be created");
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );
    if (!product) return res.status(404).send("The product cannot be found or updated");
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a product (promise style)
router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        res
          .status(200)
          .json({ success: true, message: "Product is deleted successfully", deletedId: req.params.id });
      } else {
        res.status(404).json({ success: false, message: "Product not found" });
      }
    })
    .catch((err) => {
      res.status(400).json({ success: false, error: err.message });
    });
});

// GET total count of products
router.get("/get/count", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.send({ productCount });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// GET featured products
router.get("/get/featured/:count", async (req, res) => {
  try {
    const count = req.params.count ? parseInt(req.params.count) : 0;
    const products = await Product.find({ isFeatured: true }).limit(count);
    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No featured products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
