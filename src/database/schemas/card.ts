import {Schema} from "mongoose";
import { z } from "zod";
import { cardSchema } from "../../validations/card.ts";
import { ObjectId } from "mongodb";
import { Address } from "../../validations/address.ts";
import { Image } from "../../validations/image.ts";
import { addressDBSchema } from "./address.ts";
import { imageDBSchema } from "./image.ts";

export type CardDB = z.infer<typeof cardSchema> & {
    userId: string;
    address: Address;
    image?: Image;
    bizNumber: number;
    likes: Array<string>;
    createdAt?: Date;
    _id: ObjectId;
};

export const cardDBSchema = new Schema<CardDB>({
    title: {
        type: String,
        required: true,
    },
    subtitle: { 
        type: String, 
        required: true },

    description: { 
        type: String, 
        required: true },

    phone: {
        type: String,
        minlength: 9,
        maxlength: 15,
        required: true,
    },

    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
    },
    
    web: {
        type: String,
        required: true,
    },

    address: { 
        type: addressDBSchema, 
        required: true 
    },
    
    image: {
        type: imageDBSchema,
    },

    userId: {
        type: String,
        required: true,
    },

    bizNumber: {
        type: Number,
        required: true,
        default: () => Math.floor(Math.random() * 1000000),
        unique: true,
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now
    },

    likes: [{
        type: String,
    }]
});