import express, { Router } from "express";
import { body } from "express-validator";
import * as authController from "../controller/auth";
import User from "../models/user";

const router: Router = express.Router();

router.post(
    "/signup",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom(async (value, _) => {
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject("E-mail address registered.");
                    }
                });
            })
            .normalizeEmail(),
        body("password").trim().isLength({ min: 5 }),
        body("name").trim().isLength({ min: 3 }).not().isEmpty(),
    ],
    authController.signup
);

router.post(
    "/login",
    [
        body("name").trim().isLength({ min: 3 }).not().isEmpty(),
        body("password").trim().isLength({ min: 5 }),
    ],
    authController.login
);

router.get("/status", authController.getStatus);

export default router;
