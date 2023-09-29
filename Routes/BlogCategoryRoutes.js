const express = require("express");
const {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogCategory,
  getAllBlogCategory,
} = require("../Controllers/BlogCategoryController");
const { authMiddleware, isAdmin } = require("../Middleware/AuthMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlogCategory);
router.put("/:id", authMiddleware, isAdmin, updateBlogCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteBlogCategory);
router.get("/:id", authMiddleware, isAdmin, getBlogCategory);
router.get("/", getAllBlogCategory);

module.exports = router;
