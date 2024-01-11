import mongoose, { Document, Schema } from "mongoose";

export type UserType = Document & {
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	position: number;
    createdAt?: Date;
};

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, unique: true },
		password: String,
		firstName: String,
		lastName: String,
		position: Number,
        createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

export const User = mongoose.model<UserType>("User", UserSchema);
