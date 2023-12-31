const Category = require("../Models/ProductCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../Utils/ValidateMongoDbID");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    throw new Error("Couldn't create category" + error.message);
  }
});

//PUT Update category
const updateCategory = asyncHandler(async (req, res) => {
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
const deleteCategory = asyncHandler(async (req, res) => {
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

const getCategory = asyncHandler(async (req, res) => {
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
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch (error) {
    throw new Error("Couldn't getall category" + error.message);
  }
});
module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  getCategory
};
