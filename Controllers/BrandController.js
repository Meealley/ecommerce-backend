const asyncHandler = require("express-async-handler");
const Brand = require("../Models/BrandModel");
const validateMongoDbId = require("../Utils/ValidateMongoDbID");

//POST creating the brand model
const createBrands = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.json(brand);
  } catch (error) {
    throw new Error("Could not create brand" + error.message);
  }
});

//PUT Updating the brand model
const updateBrands = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(brand);
  } catch (error) {
    throw new Error("Could not update brand" + error.message);
  }
});

//Delete brand
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const brand = await Brand.findByIdAndDelete(id);
    res.json({
      message: "Brand deleted successfully",
      response: brand,
    });
  } catch (error) {
    throw new Error("Could not delete brand" + error.message);
  }
});

//GET getting brand
const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const brand = await Brand.findById(id);
    res.json(brand);
  } catch (error) {
    throw new Error("Could not get brand" + error.message);
  }
});

//GET get all brand
const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.find();
    res.json(brand);
  } catch (error) {
    throw new Error("Could not get all brand" + error.message);
  }
});

module.exports = {
  createBrands,
  updateBrands,
  deleteBrand,
  getAllBrand,
  getBrand,
};
