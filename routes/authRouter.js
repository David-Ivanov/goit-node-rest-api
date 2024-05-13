import express from "express";
import { current, login, logout, register, updateSubscription } from "../controllers/authControllers.js";
import auth from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", auth, logout);
userRouter.get("/current", auth, current);
userRouter.patch("/", auth, updateSubscription)

export default userRouter;