import { Request } from "express";
import { POSITION_CODE, POSITION_DEFINITION, TResponseJson } from "../types";
import jwt from "jsonwebtoken";
import { ErrorCatchMessage, SetRequestResponse } from "../helpers/error.helper";
import { UserType, User } from "../schemas/User.schema";
import bcrypt from "bcrypt";
import { getUserDataFromRequestToken } from "../helpers/token.helper";
import moment from "moment";
import { Document } from "mongoose";

export type DefinedUserType = {
	number: number;
	userId: string;
	username: string;
	firstName: string;
	lastName: string;
	position: string | number;
	createdAt: string;
};

export type UpdateUserType = {
	userId: string;
	username: string;
	firstName: string;
	lastName: string;
	position: string | number;
};

class UserModel {
	request: Request;

	constructor(request: Request) {
		this.request = request;
	}

	async createUser(userDetails: UserType): Promise<TResponseJson> {
		try {
			const { username, password, firstName, lastName, position } = userDetails;

			const founderUsername = await User.findOne({ username: username });

			if (founderUsername)
				return SetRequestResponse({
					message: "Username is already exist.",
					status: 400,
					error: true,
				});

			if (!POSITION_CODE.includes(position)) {
				return SetRequestResponse({
					message: "Invalid Selected Position",
					status: 400,
					error: true,
				});
			}

			const bcryptSalt = 10;
			const hashedPassword = await bcrypt.hash(password, bcryptSalt);

			if (!hashedPassword) {
				return SetRequestResponse({
					message: "Use processing failed!",
					status: 400,
					error: true,
				});
			}

			const newUser: Partial<UserType> = {
				username: username.replace(/\s/g, ""),
				password: hashedPassword,
				firstName,
				lastName,
				position,
			};

			const user = await User.create(newUser);

			if (!user) {
				return SetRequestResponse({
					message: "Creating user failed!",
					status: 400,
					error: true,
				});
			}

			return SetRequestResponse({
				data: {
					user: {
						userId: user._id,
						username: user.username,
						lastName: user.lastName,
						firstName: user.firstName,
						position: POSITION_DEFINITION[user.position],
						createdAt: moment(user.createdAt).format("MMMM D, YYYY"),
					},
				},
				message: "User is successfully created.",
			});
		} catch (error) {
			console.log(error);
			return SetRequestResponse({
				error: true,
				message: "Server error!",
				status: 500,
			});
		}
	}

	async getUsers(): Promise<TResponseJson> {
		try {
			const userData = await getUserDataFromRequestToken(this.request);

			if (!userData)
				return SetRequestResponse({
					message: "Unauthorize data",
					status: 401,
					error: true,
				});

			const users = await User.find().sort({ createdAt: 1 });
			const definedUsers: DefinedUserType[] = [];
			let count = 0;
			for (const user of users) {
				count++;
				definedUsers.push({
					number: count,
					userId: user._id,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					position: POSITION_DEFINITION[user.position],
					createdAt: moment(user.createdAt).format("MMMM D, YYYY"),
				});
			}

			return SetRequestResponse({ data: definedUsers });
		} catch (error: any) {
			console.log(error);
			return SetRequestResponse({
				error: true,
				message: "Server error!",
				status: 500,
			});
		}
	}

	async getUser(userId: string): Promise<TResponseJson> {
		try {
			const userData = await getUserDataFromRequestToken(this.request);

			if (!userData)
				return SetRequestResponse({
					message: "Unauthorize data",
					status: 401,
					error: true,
				});

			const user = await User.findOne({ _id: userId });

			if (!user)
				return SetRequestResponse({
					message: "No user found!",
					status: 401,
					error: true,
				});

			return SetRequestResponse({
				data: {
					userId: user._id,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					position: user.position,
					createdAt: moment(user.createdAt).format("MMMM D, YYYY"),
				},
			});
		} catch (error: any) {
			console.log(error);
			return SetRequestResponse({
				error: true,
				message: "Server error!",
				status: 500,
			});
		}
	}

	async updateUser(userDetails: UpdateUserType): Promise<TResponseJson> {
		try {
			const userData = await getUserDataFromRequestToken(this.request);

			if (!userData)
				return SetRequestResponse({
					message: "Unauthorize data",
					status: 401,
					error: true,
				});

			const { userId, username, firstName, lastName, position } = userDetails;

            const updateUser = await User.updateOne(
				{ _id: userId },
				{ $set: { username, firstName, lastName, position } }
			);

			if (!updateUser)
				return SetRequestResponse({
					message: "Update user failed!",
					status: 400,
					error: true,
				});

			return SetRequestResponse({
				data: { user: {...userDetails, position: POSITION_DEFINITION[Number(position)]} },
                message: "User has been updated."
			});

		} catch (error: any) {
			console.log(error);
			return SetRequestResponse({
				error: true,
				message: "Server error!",
				status: 500,
			});
		}
	}


	async deleteUser(userId: string): Promise<TResponseJson> {
		try {
			const userData = await getUserDataFromRequestToken(this.request);

			if (!userData)
				return SetRequestResponse({
					message: "Unauthorize data",
					status: 401,
					error: true,
				});

            const deleteUser = await User.deleteOne({ _id: userId });

            if (!deleteUser)
				return SetRequestResponse({
					message: "Delete user failed!",
					status: 400,
					error: true,
				});

			return SetRequestResponse({
				data: { userId },
                message: "User has been deleted."
			});

		} catch (error: any) {
			console.log(error);
			return SetRequestResponse({
				error: true,
				message: "Server error!",
				status: 500,
			});
		}
	}
}

export default UserModel;
