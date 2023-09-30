const Coupon = require("../Models/CouponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../Utils/ValidateMongoDbID");

//POST
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (error) {
    throw new Error("Couldn't create coupon" + error.message);
  }
});

//GET all coupon
const getAllCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.find();
    res.json(coupon);
  } catch (error) {
    throw new Error("Couldn't find coupon" + error.message);
  }
});

//PUT coupon
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    res.json(coupon);
  } catch (error) {
    throw new Error("Couldn't update coupon" + error.message);
  }
});

//PUT coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const coupon = await Coupon.findByIdAndDelete(id);
    res.json({
      status: "Coupon deleted successfully",
      response: coupon,
    });
  } catch (error) {
    throw new Error("Couldn't delete coupon" + error.message);
  }
});

module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon };
