import env from "../config/index.ts";
import { logger } from "../logger/logger.ts";
import authService from "../services/auth-service.ts";
import { InitialUsers } from "./initial-users.ts";
import { UserModel } from "./models.ts";

const initDB = async () => {

if (env.NODE_ENV !== "test") {
    try {
        const usersCount = await UserModel.countDocuments();

    if (usersCount === 0) {
        logger.info("Initializing Database with initial users...");

        for (const user of InitialUsers) {
            const hashedPassword = await authService.hashPassword(user.password);
            const savedUser = await new UserModel({
            ...user,
            password: hashedPassword,
        }).save();

            logger.trace(`Saved user: ${savedUser._id}`);
        }

        logger.info("Database initialized successfully");
    }
    } catch (error) {
        logger.error({ err: error as Error }, "Error initializing database");
    }
}
};

export default initDB;

