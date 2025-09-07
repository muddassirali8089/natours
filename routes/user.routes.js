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
import { loginLimiter } from "../utils/rateLimiters.js";
import { verifyEmail } from "../controllers/verifyEmail.js";


const router = express.Router();

router.post("/forgotPassword", forgotPassword);
router.get("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", protect, updateMyPassword);
router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

router.get("/", getAllUsers);
router.post("/signup", signup);
router.patch("/verify-email/:token", verifyEmail);
router.post("/login", loginLimiter, login);
router.get("/:id", getUser);

// PATCH /api/v1/users/:id (Admin only)
router.patch("/:id", protect, restrictTo("admin"), updateUser);

// DELETE /api/v1/users/:id (Admin only)
router.delete("/:id", protect, restrictTo("admin"), deleteUser);

// router.post("/" , createUser);

export default router;
