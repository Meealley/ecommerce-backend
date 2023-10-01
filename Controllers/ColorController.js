const asyncHandler = require("express-async-handler");
const Color = require("../Models/ColorModel");
const validateMongoDbId = require("../Utils/ValidateMongoDbID");

//POST creating the Color model
const createColors = asyncHandler(async (req, res) => {
  try {
    const color = await Color.create(req.body);
    res.json(color);
  } catch (error) {
    throw new Error("Could not create Color" + error.message);
  }
});

//PUT Updating the Color model
const updateColors = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const color = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(color);
  } catch (error) {
    throw new Error("Could not update Color" + error.message);
  }
});

//Delete Color
const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const color = await Color.findByIdAndDelete(id);
    res.json({
      message: "Color deleted successfully",
      response: color,
    });
  } catch (error) {
    throw new Error("Could not delete Color" + error.message);
  }
});

//GET getting Color
const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const color = await Color.findById(id);
    res.json(color);
  } catch (error) {
    throw new Error("Could not get Color" + error.message);
  }
});

//GET get all Color
const getAllColor = asyncHandler(async (req, res) => {
  try {
    const color = await Color.find();
    res.json(color);
  } catch (error) {
    throw new Error("Could not get all Color" + error.message);
  }
});

module.exports = {
  createColors,
  updateColors,
  deleteColor,
  getAllColor,
  getColor,
};
