import { Request } from "express";
import jwt from "jsonwebtoken";

export const getUserDataFromRequestToken = async (request: Request) => {
    return new Promise((resolve, reject) => {
        const token = request.cookies.token;
        if(!token) reject(false)

        const jwtSecret = process.env.JWT_SECRET || "";
        jwt.verify(token, jwtSecret, {}, (error, userData) => {
            if(error) reject(false);
            resolve(userData);
        })
    })
}