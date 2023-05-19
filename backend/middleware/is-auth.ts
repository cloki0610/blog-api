import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface TokenRequest extends Request {
    userId?: string;
}

interface docodedPayload extends jwt.JwtPayload {
    userId: string;
}

export default (req: TokenRequest, res: Response, next: NextFunction) => {
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
            process.env.JWTSECRET!
        ) as docodedPayload;
    } catch (err) {
        res.status(500);
        throw err;
    }
    if (!decodedToken) {
        res.status(401);
        throw new Error("Not authenticated.");
    }
    req.userId = decodedToken.userId;
    next();
};
