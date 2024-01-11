import express from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/User.controller";

const userRouter = express.Router();
userRouter.post("/create", createUser);
userRouter.get("/getUsers", getUsers);
userRouter.post("/getUser", getUser);
userRouter.post("/updateUser", updateUser);
userRouter.post("/deleteUser", deleteUser);

export default userRouter;
