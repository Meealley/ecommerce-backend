const express = require("express");
const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addtoWishlist,
  rating,
  uploadImages,
} = require("../Controllers/ProductController");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../Middleware/AuthMiddleware");
const { uploadPhoto, productImgResize } = require("../Middleware/UploadImages");

router.post("/", authMiddleware, isAdmin, createProduct);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10), productImgResize, uploadImages
);
router.get("/:id", getSingleProduct);
router.put("/wishlist", authMiddleware, addtoWishlist);
router.put("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/", getAllProducts);

module.exports = router;
