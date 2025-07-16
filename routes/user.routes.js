import express from "express"
import { getAllUsers , getUser , createUser , deleteUser , updateUser } from "../controllers/user.controller.js";


const router = express.Router();


router.get("/" , getAllUsers);

router.post("/" , createUser);
router.get("/:id" , getUser)
router.delete("/:id" , deleteUser)
router.patch("/:id" , updateUser)


export default router;