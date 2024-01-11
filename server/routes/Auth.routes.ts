import express from "express";
import { authLogin, checkUserLogin } from "../controllers/Auth.controller";

const authRouter = express.Router();
authRouter.post("/login", authLogin);
authRouter.post("/checkUserLogin", checkUserLogin);

export default authRouter;
