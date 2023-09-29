const Category = require("../Models/BlogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../Utils/ValidateMongoDbID");

const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    throw new Error("Couldn't create category" + error.message);
  }
});

//PUT Update category
const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(category);
  } catch (error) {
    throw new Error("Couldn't update category" + error.message);
  }
});

//DELETE delete category
const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const category = await Category.findByIdAndDelete(id);
    res.json({
      message: "Category deleted successfully",
      response: category,
    });
  } catch (error) {
    throw new Error("Couldn't delete category" + error.message);
  }
});

const getBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const category = await Category.findById(id);
    res.json(category);
  } catch (error) {
    throw new Error("Couldn't find category" + error.message);
  }
});

//GETALL category
const getAllBlogCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch (error) {
    throw new Error("Couldn't getall category" + error.message);
  }
});

module.exports = { createBlogCategory, updateBlogCategory, deleteBlogCategory, getAllBlogCategory, getBlogCategory,  };
