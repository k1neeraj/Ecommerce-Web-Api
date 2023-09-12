const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const mongoose = require("mongoose");

//  GET all products
router.get(`/`, async (req, res) => {
  //localhost:3000/api/v1/products?categories=2342342,234234
  let filter = [];
  if (req.query.categories) {
    filter = {category: req.query.categories.split(",")};
  }

  const productList = await Product.find({ category: filter }).populate(
    "category"
  ); //.select("name image -_id"); // .select gives the selected data which i asked from the schema

  //catching errors
  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send(productList);
});

// GET a product by id
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category"); //Modify a query instance so that, when executed, it will populate child records for the specified collection, optionally filtering by subcriteria

  if (!product) {
    res.status(500).json({ success: false });
  }

  res.send(product);
});

// CREATE a product
router.post(`/`, async (req, res) => {
  // to find category of the product with reference to category in API
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

  if (!product) {
    return res.status(500).send("The product cannot be created");
  }
  res.send(product);

  // promise based code
  // product
  //   .save()
  //   .then((createdProduct) => {
  //     res.status(201).json(createdProduct);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       error: err,
  //       success: false,
  //     });
  //   });
});

// UPDATE product
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }
  // to validate the category below
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
      category: req.body.category, // category is validating here
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true } // It means it will show the updated data not the old data
  );

  if (!product) return res.status(500).send("the product cannot be updated");

  res.send(product);
});

// DELETE a product
router.delete("/:id", async (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "product is deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product is not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// GET total count of product for Admin Panel
router.get(`/get/count`, async (req, res) => {
  try {
    const productCount = await Product.countDocuments();

    if (!productCount) {
      res.status(500).json({ success: false });
    }

    res.send({ productCount: productCount });
  } catch (error) {
    // Handle any errors that occur during the counting process
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// GET featured product
router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  // try {
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }

  res.send(products);
  //  } catch (error) {
  // Handle any errors that occur during the counting process
  // console.error(error);
  //  res.status(500).json({ success: false, error: "Internal Server Error" });
  //}
});

module.exports = router;
