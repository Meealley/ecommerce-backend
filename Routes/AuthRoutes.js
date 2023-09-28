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
} = require("../Controllers/UserController");
const { authMiddleware, isAdmin } = require("../Middleware/AuthMiddleware");

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken)
router.put("/password",authMiddleware,updatePassword)
router.put('/reset-password/:token', resetPassword)
router.post("/login", loginUser);
router.get("/get-users", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/:id", deleteUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUsers);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUsers);

module.exports = router;
