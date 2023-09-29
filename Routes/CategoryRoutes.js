const express = require("express");
const {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require("../Controllers/CategoryController");
const { authMiddleware, isAdmin } = require("../Middleware/AuthMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/", getAllCategory);
router.get("/:id", getCategory);

module.exports = router;
