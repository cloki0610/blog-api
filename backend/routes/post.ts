import express, { Router } from "express";
import { body } from "express-validator";
import * as postController from "../controller/post";

const router: Router = express.Router();

router.get("/", postController.getPosts);

router.get("/:postId", postController.getPost);

router.post(
    "/new",
    [
        body("title").trim().isLength({ min: 5 }).isString(),
        body("content").trim().isLength({ min: 5 }).isString(),
    ],
    postController.newPost
);

router.put(
    "/:postId",
    [
        body("title").trim().isLength({ min: 5 }).isString(),
        body("content").trim().isLength({ min: 5 }).isString(),
    ],
    postController.updatePost
);

router.delete("/:postId", postController.deletePost);

export default router;
