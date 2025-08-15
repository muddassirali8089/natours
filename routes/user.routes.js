import express from "express"
import { signup, login, forgotPassword, resetPassword, updateMyPassword, protect } from "../controllers/authContrller.js";
import {deleteMe, getAllUsers, updateMe , getUser} from "../controllers/user.controller.js"
import {loginLimiter} from "../utils/rateLimiters.js"

const router = express.Router();



router.post("/forgotPassword" , forgotPassword)
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", protect, updateMyPassword);
router.patch("/updateMe" ,protect, updateMe)
router.delete("/deleteMe" ,protect, deleteMe)

router.get("/" , getAllUsers);
router.post("/signup" , signup)
router.post("/login",   loginLimiter , login)
router.get("/:id" , getUser)


// router.post("/" , createUser);
// router.delete("/:id" , deleteUser)
// router.patch("/:id" , updateUser)


export default router;