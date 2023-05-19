import { Schema, model, models, Document } from "mongoose";
import { IUser } from "./user";

export interface IPost extends Document {
    creator: IUser;
    title: string;
    content: string;
}

const PostSchema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        title: {
            type: String,
            required: [true, "Title is required."],
        },
        content: {
            type: String,
            required: [true, "Content is required."],
        },
    },
    { timestamps: true }
);

const Post = models.Post || model("Post", PostSchema);

export default Post;
