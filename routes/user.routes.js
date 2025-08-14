import express from "express"
import { signup, login, forgotPassword, resetPassword, updateMyPassword, protect } from "../controllers/authContrller.js";
import {getAllUsers, updateMe} from "../controllers/user.controller.js"


const router = express.Router();



router.post("/forgotPassword" , forgotPassword)
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", protect, updateMyPassword);
router.patch("/updateMe" ,protect, updateMe)

router.get("/" , getAllUsers);
router.post("/signup" , signup)
router.post("/login", login)


// router.post("/" , createUser);
// router.get("/:id" , getUser)
// router.delete("/:id" , deleteUser)
// router.patch("/:id" , updateUser)


export default router;