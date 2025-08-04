import express from "express"
import { createUser } from "../controllers/authContrller.js";


const router = express.Router();


router.post("/signup" , createUser)
// router.get("/" , getAllUsers);

// router.post("/" , createUser);
// router.get("/:id" , getUser)
// router.delete("/:id" , deleteUser)
// router.patch("/:id" , updateUser)


export default router;