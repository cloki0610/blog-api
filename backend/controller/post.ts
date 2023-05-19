import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Post, { IPost } from "../models/post";
import User from "../models/user";
import type { TokenRequest } from "../middleware/is-auth";

// @desc Get posts
// @route GET /api/post
// @access Public
export const getPosts = asyncHandler(
    async (req: Request, res: Response, next) => {
        const page = req.query?.page as string;
        const currentPage = page ? parseInt(page) : 1;
        const perPage = 6;
        try {
            const totalItems = await Post.find().countDocuments();
            const posts: IPost[] = await Post.find<IPost>()
                .populate("creator")
                .skip((currentPage - 1) * perPage)
                .limit(perPage);

            res.status(200).json({
                message: `Page ${currentPage} Posts fetched.`,
                posts: posts,
                totalItems: totalItems,
            });
        } catch (err: any) {
            next(err);
        }
    }
);

// @desc Get posts
// @route GET /api/post/:postId
// @access Public
export const getPost = asyncHandler(
    async (req: Request, res: Response, next) => {
        const postId = req.params.postId;
        try {
            const post: IPost | null = await Post.findById<IPost>(postId);
            if (!post) {
                res.status(404);
                throw new Error("Could not find post.");
            }
            res.status(200).json({ message: "Post fetched.", post: post });
        } catch (err: any) {
            next(err);
        }
    }
);

// @desc Create new post
// @route POST /api/post/new
// @access Private
export const newPost = asyncHandler(
    async (req: TokenRequest, res: Response, next) => {
        // Get validation result
        const errors = validationResult(req);
        // Check if error message in errors array
        if (!errors.isEmpty()) {
            res.status(422);
            throw new Error("Validation failed, entered data is incorrect.");
        }
        // Create new object by scheme
        const post: IPost = new Post({
            title: req.body.title,
            content: req.body.content,
            creator: req.userId,
        });
        // Save new record to mongoDB then send response
        try {
            await post.save();
            const user = await User.findById(req.userId);
            user.posts.push(post);
            await user.save();
            res.status(201).json({
                message: "Post created successfully!",
                post: post,
                creator: { _id: user._id, name: user.name },
            });
        } catch (err) {
            next(err);
        }
    }
);

// @desc Update post
// @route PUT /api/post/:postId
// @access Private
export const updatePost = asyncHandler(
    async (req: TokenRequest, res: Response, next) => {
        // Get validation result
        const errors = validationResult(req);
        // Check if error message in errors array
        if (!errors.isEmpty()) {
            res.status(422);
            throw new Error("Validation failed, entered data is incorrect.");
        }
        try {
            const post = await Post.findById(req.params.postId);
            if (!post) {
                res.status(404);
                throw new Error("Post not found.");
            }
            // Check if user is the creator
            if (post.creator.toString() !== req.userId) {
                res.status(422);
                throw new Error("Not authorized.");
            }
            post.title = req.body.title;
            post.content = req.body.content;
            const result = await post.save();
            res.status(200).json({ message: "Post Updated", post: result });
        } catch (err) {
            next(err);
        }
    }
);

// @desc Delete post
// @route DELETE /api/post/:postId
// @access Private
export const deletePost = asyncHandler(
    async (req: TokenRequest, res: Response, next) => {
        const postId: string = req.params.postId;
        try {
            const post: IPost | null = await Post.findById(postId);
            if (!post) {
                res.status(404);
                throw new Error("No post found.");
            }
            // Check if user is the creator
            if (post.creator.toString() !== req.userId) {
                res.status(422);
                throw new Error("Not authorized.");
            }
            await Post.findByIdAndRemove(postId);
            const user = await User.findById(req.userId);
            user.posts.pull(postId);
            await user.save();
            res.status(200).json({ message: "Post Deleted" });
        } catch (err) {
            next(err);
        }
    }
);
