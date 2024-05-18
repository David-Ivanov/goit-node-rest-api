import express from "express";
import { current, login, logout, register, updateAvatar, updateSubscription } from "../controllers/authControllers.js";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const userRouter = express.Router();

const jsonParse = express.json();

userRouter.post("/register", jsonParse, register);
userRouter.post("/login", jsonParse, login);
userRouter.post("/logout", auth, logout);
userRouter.get("/current", auth, current);
userRouter.patch("/", auth, jsonParse, updateSubscription);
userRouter.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

export default userRouter;