import { Router } from "express";
import { validateUser, validateUserUpdate } from "../middleware/validate.ts";
import { isAdmin } from "../middleware/is-admin.ts";
import validateToken from "../middleware/validate-token.ts";
import userService from "../services/user-service.ts";

const router = Router();

// POST /api/v1/users - Registration
router.post("/", validateUser, async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/users/login - Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/users - User List (Admin)
router.get("/", validateToken, isAdmin, async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/users/:id - User Profile
router.get("/:id", validateToken, async (req, res, next) => {
  try {
    const requester = req.user!;
    const targetUserId = String(req.params.id);
    const requesterId = String(requester._id);

    if (requesterId !== targetUserId && !requester.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await userService.getUser(targetUserId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/users/:id - Account Update (Self Only)
router.put("/:id", validateToken, validateUserUpdate, async (req, res, next) => {
  try {
    const requesterId = String(req.user?._id);
    const targetUserId = String(req.params.id);

    if (requesterId !== targetUserId) {
      return res.status(403).json({ message: "Access denied. You can only update your own account." });
    }

    const updatedUser = await userService.updateUser(targetUserId, req.body);
    res.json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/users/:id - Change isBusiness status
router.patch("/:id", validateToken, async (req, res, next) => {
  try {
    const requesterId = String(req.user?._id);
    const targetUserId = String(req.params.id);

    if (requesterId !== targetUserId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { isBusiness } = req.body;
    const updatedUser = await userService.changeBusinessStatus(targetUserId, Boolean(isBusiness));
    res.json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/users/:id - Delete Account
router.delete("/:id", validateToken, async (req, res, next) => {
  try {
    const requester = req.user!;
    const targetUserId = String(req.params.id);
    const requesterId = String(requester._id);

    const deletedUser = await userService.deleteUser(
      targetUserId,
      requesterId,
      requester.isAdmin
    );

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    next(error);
  }
});

export default router;