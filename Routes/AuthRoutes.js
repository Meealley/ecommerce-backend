const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUsers,
  unblockUsers,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishList,
  saveUserAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders
} = require("../Controllers/UserController");
const { authMiddleware, isAdmin } = require("../Middleware/AuthMiddleware");

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/password", authMiddleware, updatePassword);
router.put("/reset-password/:token", resetPassword);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.post("/cart", authMiddleware, userCart);
router.get('/get-orders', authMiddleware, getOrders)
router.get("/cart", authMiddleware, getUserCart);
router.delete("/cart", authMiddleware, emptyCart);
router.get("/get-users", getAllUser);
router.get("/wishlist", authMiddleware, getWishList);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/:id", deleteUser);
router.put("/save-address", authMiddleware, saveUserAddress);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUsers);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUsers);

module.exports = router;
