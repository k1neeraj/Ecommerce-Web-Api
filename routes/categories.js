const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

// GET all categories
router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

// GET a category by id
router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res
      .status(500)
      .json({ message: "The category with the given id was not found." });
  }
  res.status(200).send(category);
});

// POST a category
// code made in async and await way
router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category = await category.save();

  if (!category) return res.status(404).send("the category cannot be created");

  res.send(category);
});

// UPDATE a category
router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true } // It means it will show the updated data not the old data
  );

  if (!category) return res.status(404).send("the category cannot be created");

  res.send(category);
});

// DELETE a category
// code made in promise way
router.delete("/:id", async (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "category is deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "category is not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
