import mongoose from "mongoose";
import { type DBUser, type IUserModel, type IUserDocument, userDbSchema } from "./schemas/user.ts";
import { cardDBSchema, type CardDB } from "./schemas/card.ts";
import authService from "../services/auth-service.ts";

userDbSchema.methods.setPassword = async function (password: string) {
  this.password = await authService.hashPassword(password);
};

userDbSchema.methods.comparePassword = async function (password: string) {
  return await authService.validatePassword(password, this.password);
};

userDbSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email });
};

const UserModel = mongoose.model<IUserDocument, IUserModel>("User", userDbSchema);
const CardModel = mongoose.model<CardDB>("Card", cardDBSchema);

export { UserModel, CardModel };
