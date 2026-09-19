import { UserModel } from "../database/models.ts";
import { logger } from "../logger/logger.ts";
import { NotFoundError, HttpError } from "../error/custom-error.ts";
import authService from "./auth-service.ts";
import { type User } from "../validations/user.ts";

const userService = {
  createUser: async (userData: User) => {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      logger.error("[createUser]: Email already registered");
      throw new HttpError("Email already registered", 400);
    }

    const user = new UserModel(userData);
    await user.setPassword(userData.password);
    
    const savedUser = await user.save();
    const userObj = savedUser.toObject();
    delete userObj.password;
    return userObj;
  },

  loginUser: async (email: string, password: string) => {
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      logger.error("[loginUser]: Invalid email or password");
      throw new HttpError("Invalid email or password", 401);
    }

    const isValidPassword = await (
      user as typeof user & {
        comparePassword(password: string): Promise<boolean>;
      }
    ).comparePassword(password);
    if (!isValidPassword) {
      logger.error("[loginUser]: Invalid credentials");
      throw new HttpError("Invalid email or password", 401);
    }

    const token = await authService.generateJWT({
      _id: user._id.toString(),
      email: user.email,
      isBusiness: user.isBusiness,
      isAdmin: user.isAdmin,
    });

    return token;
  },

  getUsers: async () => {
    return await UserModel.find().select("-password");
  },

  getUser: async (userId: string) => {
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      logger.error("[getUser]: No such user found");
      throw new NotFoundError("No such user found");
    }
    return user;
  },

  updateUser: async (userId: string, updateData: Partial<User>) => {
    delete updateData.password;
    delete updateData.isAdmin;

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      logger.error("[updateUser]: No such user found");
      throw new NotFoundError("No such user found");
    }

    return updatedUser;
  },

  changeBusinessStatus: async (userId: string, isBusiness: boolean) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isBusiness },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      logger.error("[changeBusinessStatus]: No such user found");
      throw new NotFoundError("No such user found");
    }

    return updatedUser;
  },

  deleteUser: async (userId: string, requesterId: string, isAdmin: boolean) => {
    if (userId !== requesterId && !isAdmin) {
      logger.error("[deleteUser]: Unauthorized deletion attempt");
      throw new HttpError("Only the account owner or an admin can delete this user", 403);
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId).select("-password");
    if (!deletedUser) {
      logger.error("[deleteUser]: No such user found");
      throw new NotFoundError("No such user found");
    }

    return deletedUser;
  },
};

export default userService;