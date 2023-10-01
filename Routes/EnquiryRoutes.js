const express = require("express");
const { authMiddleware, isAdmin } = require("../Middleware/AuthMiddleware");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getAllEnquiry,
} = require("../Controllers/EnquiryController");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createEnquiry);
router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);
router.get("/:id", getEnquiry);
router.get("/", getAllEnquiry);

module.exports = router;
