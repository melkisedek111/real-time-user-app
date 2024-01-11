import { Request } from "express";
import { POSITION_DEFINITION, TResponseJson } from "../types";
import jwt from "jsonwebtoken";
import { ErrorCatchMessage, SetRequestResponse } from "../helpers/error.helper";
import { User } from "../schemas/User.schema";
import bcrypt from "bcrypt";
import { getUserDataFromRequestToken } from "../helpers/token.helper";

export type LoginDetailsType = {
    username: string;
    password: string;
}




class AuthModel {
	request: Request;

	constructor(request: Request) {
		this.request = request;
	}

	async checkUserLogin(): Promise<TResponseJson> {
		try {

			const token = this.request.cookies?.token;
			const jwtSecret = process.env.JWT_SECRET || "";

			if(!(token && jwtSecret)) return SetRequestResponse({message: "Token expired.", status: 401, error: true});
			const userData = await getUserDataFromRequestToken(this.request);
			return SetRequestResponse({data: userData});

		} catch (error) {
			console.log(error);
			return SetRequestResponse({error: true, message: "Server error!", status: 500});
		}

	}

	async authLogin(loginDetails: LoginDetailsType): Promise<TResponseJson> {

		try {
			const { username, password }: LoginDetailsType = loginDetails;
			const foundUser = await User.findOne({ username });
            if(!foundUser) return SetRequestResponse({message: "Username or password does not matched!", status: 401, error: true});

            const isPasswordOk = await bcrypt.compare(password, foundUser.password);

            if (!isPasswordOk) return SetRequestResponse({message: "Username or password does not matched!", status: 401, error: true});

            const jwtSecret = process.env.JWT_SECRET || "";
            const user = {userId: foundUser._id, username: foundUser.username, lastName: foundUser.lastName, firstName: foundUser.firstName, position: POSITION_DEFINITION[foundUser.position]}
			const token = jwt.sign(user,jwtSecret, {expiresIn: "1h"});
            
            return SetRequestResponse({data: { user , token }});
		} catch (error) {
            console.log(error);
			return SetRequestResponse({error: true, message: "Server error!", status: 500});
		}
	}
}

export default AuthModel;
