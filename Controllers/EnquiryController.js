const asyncHandler = require("express-async-handler");
const Enquiry = require('../Models/EnqModel')
const validateMongoDbId = require("../Utils/ValidateMongoDbID");

//POST creating the Enquiry model
const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.json(enquiry);
  } catch (error) {
    throw new Error("Could not create Enquiry" + error.message);
  }
});

//PUT Updating the Enquiry model
const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const enquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(enquiry);
  } catch (error) {
    throw new Error("Could not update Enquiry" + error.message);
  }
});

//Delete Enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const enquiry = await Enquiry.findByIdAndDelete(id);
    res.json({
      message: "Enquiry deleted successfully",
      response: enquiry,
    });
  } catch (error) {
    throw new Error("Could not delete Enquiry" + error.message);
  }
});

//GET getting Enquiry
const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const enquiry = await Enquiry.findById(id);
    res.json(enquiry);
  } catch (error) {
    throw new Error("Could not get Enquiry" + error.message);
  }
});

//GET get all Enquiry
const getAllEnquiry = asyncHandler(async (req, res) => {
  try {
    const enquiry = await Enquiry.find();
    res.json(enquiry);
  } catch (error) {
    throw new Error("Could not get all Enquiry" + error.message);
  }
});

module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getAllEnquiry,
  getEnquiry,
};

