import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    password?: string;
    email: string;
}

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is required!"],
            match: [
                /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
                "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
            ],
        },
        password: {
            type: String,
            select: false,
            required: [true, "Password is required!"],
        },
        email: {
            type: String,
            unique: [true, "Email already exists!"],
            required: [true, "Email is required!"],
        },
    },
    { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
