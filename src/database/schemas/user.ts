import { Schema, Document, Model } from "mongoose";
import { type User } from "../../validations/user.ts";
import { addressDBSchema } from "./address.ts";
import { ObjectId } from "mongodb";

export type DBUser = User & {
    isAdmin: boolean;
    createdAt?: Date;
    _id: ObjectId;
};

export interface IUserDocument extends Omit<DBUser, "_id">, Document {
    setPassword(password: string): Promise<void>;
};

export interface IUserModel extends Model<IUserDocument> {
    findByEmail(email: string): Promise<IUserDocument>;
}

export const userDbSchema = new Schema<DBUser, IUserModel> ({
    name : {
        type: new Schema({
            first: { type: String, required: true },
            middleName: { type: String, required: false, default: "" },
            last: { type: String, required: true }
        }, { _id: false }),
        required: true,
    },

    address: {
        type: addressDBSchema,
        required: true,
    },

    image: {
        type: new Schema({
            url: { type: String, required: false, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" },
            alt: { type: String, required: false, default: "user profile image" }
        }, { _id: false }),
        required: false,
        default: {
            alt: "user profile image",
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        },
    },

    phone: {
        type: String,
        minlength: 9,
        maxlength: 15,
        required: true,
    },

    email: {
        type: String,
        minlength: 5,
        maxlength: 250,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        minlength: 7,
        select: false,
        maxlength: 100,
        required: true,
    },

    isAdmin: {
        type: Boolean,
        required: false,
        default: false,
    },

    isBusiness: {
        type: Boolean,
        required: true,
    },

    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
    },
});