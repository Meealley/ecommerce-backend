const express = require("express");
const {
  createBrands,
  updateBrands,
  deleteBrand,
  getBrand,
  getAllBrand,
} = require("../Controllers/BrandController");
const { authMiddleware, isAdmin } = require("../Middleware/AuthMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrands);
router.put("/:id", authMiddleware, isAdmin, updateBrands);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/:id", authMiddleware, isAdmin, getBrand);
router.get("/", getAllBrand);

module.exports = router;
