import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  protect,
  restrictTo,
} from "../controllers/authContrller.js";
import {
  deleteMe,
  getAllUsers,
  updateMe,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";
import { loginLimiter, generalLimiter } from "../utils/rateLimiters.js";
import { verifyEmail } from "../controllers/verifyEmail.js";

const router = express.Router();

// Authentication routes (no protection needed)
router.post("/signup", signup);
router.post("/login", loginLimiter, login);
router.patch("/verify-email/:token", verifyEmail);
router.post("/forgotPassword", generalLimiter, forgotPassword);
router.get("/resetPassword/:token", generalLimiter, resetPassword);

// Protected routes - User can manage their own account
router.patch("/updateMyPassword", protect, updateMyPassword);
router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

// GET /api/v1/users
// ✅ Only admins and lead-guides can see all users
router.get("/", protect, restrictTo("admin", "lead-guide"), getAllUsers);

// GET /api/v1/users/:id
// ✅ Authenticated users can read user profiles
router.get("/:id", protect, getUser);

// PATCH /api/v1/users/:id
// ✅ Only admins can update any user
router.patch("/:id", protect, restrictTo("admin"), updateUser);

// DELETE /api/v1/users/:id
// ✅ Only admins can delete users
router.delete("/:id", protect, restrictTo("admin"), deleteUser);

export default router;
