import express, { Router } from "express";
import { body } from "express-validator";
import * as postController from "../controller/post";
import isAuth from "../middleware/is-auth";

const router: Router = express.Router();

router.get("/", postController.getPosts);

router.get("/:postId", postController.getPost);

router.post(
    "/new",
    isAuth,
    [
        body("title").trim().isLength({ min: 5 }).isString(),
        body("content").trim().isLength({ min: 5 }).isString(),
    ],
    postController.newPost
);

router.put(
    "/:postId",
    isAuth,
    [
        body("title").trim().isLength({ min: 5 }).isString(),
        body("content").trim().isLength({ min: 5 }).isString(),
    ],
    postController.updatePost
);

router.delete("/:postId", isAuth, postController.deletePost);

export const PostRouter = (): express.Router => router;
