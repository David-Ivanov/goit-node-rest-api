import express from "express";
import { current, login, logout, register } from "../controllers/authControllers.js";
import auth from "../middleware/authMiddleware.js";

const authRouter = express.Router();

const jsonParse = express.json();

authRouter.post("/register", jsonParse, register);
authRouter.post("/login", jsonParse, login);
authRouter.post("/logout", auth, logout);
authRouter.get("/current", auth, current);

export default authRouter;