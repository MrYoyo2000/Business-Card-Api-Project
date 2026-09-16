import { Schema } from "mongoose";
import { type Name } from "../../validations/name.ts";

export const nameDBSchema = new Schema<Name>({
    first: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256,
    },
    middleName: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 256,
    },
    last: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256,
    },
});