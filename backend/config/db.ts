import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const db =
            process.env.NODE_ENV == "development" ? "localhost" : "mongo";
        const conn = await mongoose.connect(`mongodb://${db}:27017/blog-api`); // Some option default as true after mongoose 6
        mongoose.connection.on("error", (error: Error) =>
            console.log("Database connection error.", error)
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(error);
        process.exit();
    }
};

export default connectDb;
