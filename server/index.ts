import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import userRouter from "./routes/User.routes";
import connectDB from "./config/database.config";
import authRouter from "./routes/Auth.routes";
import ws from "ws";

dotenv.config();
connectDB();
const app = express();
const PORT = 4000;

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

const server = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

interface CustomWebSocket extends ws {
	userId?: string;
	username?: string;
}

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection: CustomWebSocket, request) => {
	const cookies = request.headers.cookie;

	if (cookies) {
		const tokenCookieString = cookies
			.split(";")
			.find((str) => str.startsWith("token="));
		if (tokenCookieString) {
			const [_, token] = tokenCookieString.split("=");

			if (token) {
				const jwtSecret = process.env.JWT_SECRET || "";
				jwt.verify(token, jwtSecret, {}, (error: any, userData: any) => {
					if (error) throw error;
					connection.userId = userData.userId;
					connection.username = userData.username;
				});
			}
		}

		connection.on("message", async (message) => {
			const parsedMessage = JSON.parse(message.toString());
			if (parsedMessage.isNewUser || parsedMessage.isUpdateUser || parsedMessage.isDeleteUser) {
				[...wss.clients].forEach((client: CustomWebSocket) =>
					client.send(JSON.stringify(parsedMessage))
				);
			}
		});
	}
});
