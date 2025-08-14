import express from "express"
import { signup, login, forgotPassword, resetPassword, updateMyPassword, protect } from "../controllers/authContrller.js";
import {getAllUsers} from "../controllers/user.controller.js"


const router = express.Router();



router.post("/forgotPassword" , forgotPassword)
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updatePassword", protect, updateMyPassword);

router.get("/" , getAllUsers);
router.post("/signup" , signup)
router.post("/login", login)


// router.post("/" , createUser);
// router.get("/:id" , getUser)
// router.delete("/:id" , deleteUser)
// router.patch("/:id" , updateUser)


export default router;