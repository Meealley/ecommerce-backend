const express = require("express");
const { authMiddleware, isAdmin } = require("../Middleware/AuthMiddleware");
const {
  createColors,
  updateColors,
  deleteColor,
  getColor,
  getAllColor,
} = require("../Controllers/ColorController");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createColors);
router.put("/:id", authMiddleware, isAdmin, updateColors);
router.delete("/:id", authMiddleware, isAdmin, deleteColor);
router.get("/:id", authMiddleware, isAdmin, getColor);
router.get("/", getAllColor);

module.exports = router;
