import { Request, Response } from "express";
import { UserType } from "../schemas/User.schema";
import { TResponseJson } from "../types";
import AuthModel, { LoginDetailsType } from "../models/Auth.model";

const authLogin = async (request: Request, response: Response) => {
    try {
        const loginDetails: LoginDetailsType = request.body;
        const authModel = new AuthModel(request);
        const requestResponse: TResponseJson = await authModel.authLogin(loginDetails);

        return response.status(requestResponse.status || 200).cookie("token", requestResponse.data.token, {sameSite: "lax", secure: true, maxAge: 3600000  }).json(requestResponse); 
    } catch (error) {
        return response.status(401);
    }
}

const checkUserLogin = async (request: Request, response: Response) => {
    try {
        const authModel = new AuthModel(request);
        const requestResponse: TResponseJson = await authModel.checkUserLogin();

        return response.status(requestResponse.status || 200).json(requestResponse); 
    } catch (error) {
        return response.status(401);
    }
}


export { authLogin, checkUserLogin };