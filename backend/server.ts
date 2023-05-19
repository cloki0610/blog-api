import express, { Application } from "express";
import errorHandler from "./middleware/error";
import connectDb from "./config/db";

const PORT = process.env.PORT || 8080;
const app: Application = express();

app.use(express.json());
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

app.use("/api/post", require("./routes/post"));
app.use("/api/auth", require("./routes/auth"));

app.use(errorHandler);

connectDb()
    .then(() => {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch((err) => console.log(err));
