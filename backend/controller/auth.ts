import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/user";
import type { ValidError } from "../middleware/error";
import type { TokenRequest } from "../middleware/is-auth";

// @desc Register a new user
// @route POST /api/auth/new
// @access Public
export const signup = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error: ValidError = new Error("Signup input invalid.");
            error.data = errors.array();
            res.status(422);
            throw error;
        }
        const { name, email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                email,
                name,
                password: hashedPassword,
            });
            const result = await user.save();
            res.status(201).json({
                message: "User created!",
                userId: result._id,
            });
        } catch (err) {
            if (err instanceof Error) next(err);
        }
        res.json({ message: "signup" });
    }
);

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password }: { email: string; password: string } =
            req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error: ValidError = new Error("Login input invalid.");
            error.data = errors.array();
            res.status(422);
            throw error;
        }
        try {
            const user: IUser = await User.findOne({ email }).select(
                "+password"
            );
            if (!user) {
                res.status(401);
                throw new Error("User not found.");
            }
            const isEqual = await bcrypt.compare(password, user.password!);
            if (!isEqual) {
                res.status(401);
                throw new Error("Incorrect password.");
            }
            const token = jwt.sign(
                { email: email, userId: user._id.toString() },
                process.env.LOGINSECRET!,
                { expiresIn: "1hr" }
            );
            const refreshToken = jwt.sign(
                { email: email, userId: user._id.toString() },
                process.env.REFRESHSECRET!,
                { expiresIn: "30d" }
            );
            res.status(200).json({
                token: token,
                refreshToken,
                userId: user._id.toString(),
            });
        } catch (err) {
            next(err);
        }
    }
);

// @desc    Get user status
// @route   GET /api/users/me
// @access  Private
export const getStatus = asyncHandler(
    async (req: TokenRequest, res: Response, next: NextFunction) => {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                const error = new Error("User not found.");
                res.status(404);
                next(error);
            }
            res.status(200).json({
                message: "User found",
                user,
            });
        } catch (err) {
            res.status(500);
            next(err);
        }
    }
);

export const refreshToken = asyncHandler(
    async (req: TokenRequest, res: Response, next: NextFunction) => {
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            res.status(401);
            throw new Error("Not authenticated.");
        }
        const token = authHeader.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(
                token,
                process.env.REFRESHSECRET!
            ) as docodedPayload;
        } catch (err) {
            res.status(500);
            throw err;
        }
        const user: IUser = await User.findOne({ email: decodedToken.email });
        if (decodedToken && user) {
            const token = jwt.sign(
                { email: user.email, userId: user._id.toString() },
                process.env.LOGINSECRET!,
                { expiresIn: "1hr" }
            );
            const refreshToken = jwt.sign(
                { email: user.email, userId: user._id.toString() },
                process.env.REFRESHSECRET!,
                { expiresIn: "30d" }
            );
            res.status(200).json({
                token: token,
                refreshToken,
                userId: user._id.toString(),
            });
        } else {
            res.status(401);
            throw new Error("Not authenticated.");
        }
    }
);
