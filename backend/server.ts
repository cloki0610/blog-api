import express, { Application, Request, Response, NextFunction } from "express";
import http from "http";
import dotenv from "dotenv";
import compression from "compression";
import cors from "cors";
import errorHandler from "./middleware/error";
import connectDb from "./config/db";
import { AuthRouter } from "./routes/auth";
import { PostRouter } from "./routes/post";

const PORT = process.env.PORT || 8080;
const app: Application = express();
dotenv.config();

app.use(
    cors({
        credentials: true,
    })
);
app.use(compression());
app.use(express.json()); // Body parser after Express >= 4.16.0
app.use(express.urlencoded({ extended: false }));

app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use("/api/post", PostRouter());
app.use("/api/auth", AuthRouter());
app.use("*", (req: Request, res: Response, next: NextFunction) => {
    res.status(404);
    throw new Error("Endpoint not found!");
});
app.use(errorHandler);

connectDb()
    .then(() => {
        // Create a new web server and open a port to listen request
        const server = http.createServer(app);
        server.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        );
    })
    .catch((err) => console.log(err));
