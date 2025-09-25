const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList || categoryList.length === 0) {
      return res.status(404).json({ success: false, message: "No categories found" });
    }
    res.status(200).json(categoryList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a category by id
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "The category with the given id was not found." });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST a category
router.post("/", async (req, res) => {
  try {
    // Manual field check
    if (!req.body.name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon || "",
      color: req.body.color || "",
    });
    category = await category.save();
    if (!category) return res.status(500).send("The category cannot be created");
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE a category
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon || "",
        color: req.body.color || "",
      },
      { new: true }
    );
    if (!category) return res.status(404).send("The category cannot be found or updated");
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a category
// code made in promise way
// router.delete("/:id", async (req, res) => {
//   Category.findByIdAndRemove(req.params.id)
//     .then((category) => {
//       if (category) {
//         return res
//           .status(200)
//           .json({ success: true, message: "category is deleted successfully" });
//       } else {
//         return res
//           .status(404)
//           .json({ success: false, message: "category is not found" });
//       }
//     })
//     .catch((err) => {
//       return res.status(400).json({ success: false, error: err });
//     });
// });
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (category) {
      return res.status(200).json({ success: true, message: "Category is deleted successfully" });
    } else {
      return res.status(404).json({ success: false, message: "Category is not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;