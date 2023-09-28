const { request } = require("express");
const Product = require("../Models/ProductModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

//POST Create Product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(401);
    throw new Error("Couldn't create Products: " + error.message);
  }
});

//PUT UPDATE Products
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
        slug: req?.body?.slug,
        description: req?.body?.description,
        price: req?.body?.price,
        category: req?.body?.category,
        brand: req?.body?.brand,
        quantity: req?.body?.quantity,
        images: req?.body?.images,
        color: req?.body?.color,
      },
      { new: true }
    );

    res.status(200).json(product);
  } catch (error) {
    throw new Error("Couldn't update Products: " + error.message);
  }
});

//DELETE PRODUCT deleting products
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    throw new Error("Couldn't delete Products: " + error.message);
  }
});

//GET getting a Single Product
const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    res.status(401);
    throw new Error("Couldn't get Single Product: " + error.message);
  }
});

//GET getting All Products
const getAllProducts = asyncHandler(async (req, res) => {
  //   console.log(req.query);
  try {
    //<===========Filter products
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    let query = Product.find(JSON.parse(queryStr));

    //<============Sorting Products
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    //<===============Limiting the Fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //<=============== Pagination for the products
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    console.log(page, limit, skip);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This page does not exist");
    }
    // const product = await Product.find(queryObj);
    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error("Couldn't get All Products: " + error.message);
  }
});

module.exports = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
