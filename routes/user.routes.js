import express from "express"
import { signup, login ,  } from "../controllers/authContrller.js";
import {getAllUsers} from "../controllers/user.controller.js"


const router = express.Router();

router.get("/" , getAllUsers);
router.post("/signup" , signup)
router.post("/login", login)


// router.post("/" , createUser);
// router.get("/:id" , getUser)
// router.delete("/:id" , deleteUser)
// router.patch("/:id" , updateUser)


export default router;