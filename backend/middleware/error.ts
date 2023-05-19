import { ErrorRequestHandler } from "express";
import { ValidationError } from "express-validator";

export interface ValidError extends Error {
    data?: ValidationError[];
}

const errorHandler: ErrorRequestHandler = (err: Error, _, res, _next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export default errorHandler;
