import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(
            `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/blog-api?authSource=admin`
        ); // Some option default as true after mongoose 6
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(error);
        process.exit();
    }
};

export default connectDb;
