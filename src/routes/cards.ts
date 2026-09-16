import { Router } from "express";
import { validateCard } from "../middleware/validate.ts";
import { isBusiness } from "../middleware/is-business.ts";
import { isAdmin } from "../middleware/is-admin.ts";
import cardService from "../services/card-service.ts";
import validateToken from "../middleware/validate-token.ts";

const router = Router();

// POST /api/v1/cards
router.post("/", ...isBusiness, validateCard, async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();
    const card = await cardService.createCard(req.body, userId);
    res.status(201).json({ card });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/cards
router.get("/", async (req, res, next) => {
  try {
    const cards = await cardService.getCards();
    res.json({ cards });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/cards/my-cards
router.get("/my-cards", validateToken, async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();
    const myCards = await cardService.getMyCards(userId);
    res.json({ myCards });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/cards/:id
router.get("/:id", async (req, res, next) => {
  try {
    const card = await cardService.getCard(req.params.id as string);
    res.json({ card });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/cards/:id
router.put("/:id", validateToken, validateCard, async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();
    const updatedCard = await cardService.updateCard(
      req.params.id as string,
      req.body,
      userId
    );
    res.json({ card: updatedCard });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/cards/:id (Likes)
router.patch("/:id", validateToken, async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();
    const card = await cardService.logLikes(
      req.params.id as string,
      userId
    );
    res.json({ card });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/cards/:id
router.delete("/:id", validateToken, async (req, res, next) => {
  try {
    const user = req.user!;
    const deletedCard = await cardService.deleteCard(
      req.params.id as string,
      user._id.toString(),
      user.isAdmin
    );
    res.json({ message: "Card deleted successfully", card: deletedCard });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/cards/:id/biz-number
router.patch("/:id/biz-number", ...isAdmin, async (req, res, next) => {
  try {
    const { bizNumber } = req.body;
    const updatedCard = await cardService.changeBusinessNumber(
      req.params.id as string,
      Number(bizNumber)
    );
    res.json({ message: "Business number updated", card: updatedCard });
  } catch (error) {
    next(error);
  }
});

export default router;