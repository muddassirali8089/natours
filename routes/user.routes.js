import express from "express";
import multer from "multer";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  protect,
  restrictTo,
} from "../controllers/authContrller.js";
import {
  getMe,
  getMyReviews,
  deleteMe,
  getAllUsers,
  updateMe,
  getUser,
  deleteUser,
  deactivateUser,
} from "../controllers/user.controller.js";
import { loginLimiter, generalLimiter } from "../utils/rateLimiters.js";
import { verifyEmail } from "../controllers/verifyEmail.js";

// Configure multer for memory storage (for Cloudinary)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const router = express.Router();

// Authentication routes (no protection needed)
router.post("/signup", signup);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.patch("/verify-email/:token", verifyEmail);
router.post("/forgotPassword", generalLimiter, forgotPassword);
router.patch("/resetPassword/:token", generalLimiter, resetPassword);

// Protected routes - User can manage their own account
router.get("/me", protect, getMe);
router.get("/my-reviews", protect, getMyReviews);
router.patch("/updateMyPassword", protect, updateMyPassword);
router.patch("/updateMe", protect, upload.single("photo"), updateMe);
router.delete("/deleteMe", protect, deleteMe);

// GET /api/v1/users
// ✅ Only admins and lead-guides can see all users
router.get("/", protect, restrictTo("admin", "lead-guide"), getAllUsers);

// GET /api/v1/users/:id
// ✅ Authenticated users can read user profiles
router.get("/:id", protect, getUser);

// ❌ REMOVED: Admins cannot update other users' personal info
// router.patch("/:id", protect, restrictTo("admin"), updateUser);

// ❌ REMOVED: Admins cannot force verify other users' emails  
// router.patch("/:id/verify-email", protect, restrictTo("admin"), updateUser);

// PATCH /api/v1/users/:id/deactivate
// ✅ Only admins can deactivate users (system action, not personal info)
router.patch("/:id/deactivate", protect, restrictTo("admin"), deactivateUser);

// DELETE /api/v1/users/:id
// ✅ Only admins can delete users (system action, not personal info)
router.delete("/:id", protect, restrictTo("admin"), deleteUser);

export default router;
