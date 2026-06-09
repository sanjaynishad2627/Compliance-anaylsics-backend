import express from "express";
import {
  getuser,
  signin,
  signout,
  signup,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/get-users", protect, getuser);
router.post("/signout", signout);

export default router;
