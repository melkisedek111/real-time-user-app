import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
	try {
        const url = process.env.MONGO_URL || ""
		await mongoose.connect(url);
        console.log('MongoDB connected');
	} catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default connectDB;