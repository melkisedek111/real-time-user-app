import { Request, Response } from "express";
import { UserType } from "../schemas/User.schema";
import UserModel, { UpdateUserType } from "../models/User.model";
import { TResponseJson } from "../types";


const createUser = async (request: Request, response: Response) => {
    try {
        const userDetails: UserType = request.body;
        const userModel = new UserModel(request);
        const requestResponse: TResponseJson = await userModel.createUser(userDetails);

        return response.status(requestResponse.status || 200).json(requestResponse); 
    } catch (error) {
        return response.status(401);
    }
}

const getUsers = async (request: Request, response: Response) => {
    try {
        const userModel = new UserModel(request);
        const requestResponse: TResponseJson = await userModel.getUsers();

        return response.status(requestResponse.status || 200).json(requestResponse); 
    } catch (error) {
        return response.status(401);
    }
}

const getUser = async (request: Request, response: Response) => {
    try {
        const userModel = new UserModel(request);
        const userId: string = request.body.userId;
        const requestResponse: TResponseJson = await userModel.getUser(userId);
        return response.status(requestResponse.status || 200).json(requestResponse); 
    } catch (error) {
        return response.status(401);
    }
}

const updateUser = async (request: Request, response: Response) => {
    try {
        const userModel = new UserModel(request);
        const userDetails: UpdateUserType = request.body;
        const requestResponse: TResponseJson = await userModel.updateUser(userDetails);
        return response.status(requestResponse.status || 200).json(requestResponse); 
    } catch (error) {
        return response.status(401);
    }
}

const deleteUser = async (request: Request, response: Response) => {
    try {
        const userModel = new UserModel(request);
        const userId: string = request.body.userId;
        const requestResponse: TResponseJson = await userModel.deleteUser(userId);
        return response.status(requestResponse.status || 200).json(requestResponse); 
    } catch (error) {
        return response.status(401);
    }
}

export { createUser, getUsers, getUser, updateUser, deleteUser };