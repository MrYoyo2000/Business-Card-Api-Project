import { Router } from "express";
import { validateCard } from "../middleware/validate.ts";
import { isBusiness } from "../middleware/is-business.ts";
import { isAdmin } from "../middleware/is-admin.ts";
import cardService from "../services/card-service.ts";
import validateToken from "../middleware/validate-token.ts";

const router = Router();

// GET /api/v1/cards - Get all cards (Public)
router.get("/", async (_req, res, next) => {
  try {
    const cards = await cardService.getCards();
    res.json({ cards });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/cards/my-cards - Get logged-in user cards
router.get("/my-cards", validateToken, async (req, res, next) => {
  try {
    const userId = String(req.user?._id);
    const myCards = await cardService.getMyCards(userId);
    res.json({ myCards });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/cards/biz-number/:id - Update bizNumber (Admin Only)
router.patch("/biz-number/:id", validateToken, isAdmin, async (req, res, next) => {
  try {
    const { bizNumber } = req.body;
    if (!bizNumber || isNaN(Number(bizNumber))) {
      return res.status(400).json({ message: "Valid bizNumber is required" });
    }

    const updatedCard = await cardService.changeBusinessNumber(
      req.params.id as string,
      Number(bizNumber)
    );
    res.json({ message: "Business number updated", card: updatedCard });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/cards/:id - Get specific card (Public)
router.get("/:id", async (req, res, next) => {
  try {
    const card = await cardService.getCard(req.params.id as string);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json({ card });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/cards - Create new card (Business / Admin)
router.post("/", validateToken, isBusiness, validateCard, async (req, res, next) => {
  try {
    const userId = String(req.user?._id);
    const card = await cardService.createCard(req.body, userId);
    res.status(201).json({ card });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/cards/:id - Update card (Owner / Admin)
router.put("/:id", validateToken, validateCard, async (req, res, next) => {
  try {
    const userId = String(req.user?._id);
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

// PATCH /api/v1/cards/:id - Toggle Like (Logged-in User)
router.patch("/:id", validateToken, async (req, res, next) => {
  try {
    const userId = String(req.user?._id);
    const card = await cardService.logLikes(
      req.params.id as string,
      userId
    );
    res.json({ card });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/cards/:id - Delete card (Owner / Admin)
router.delete("/:id", validateToken, async (req, res, next) => {
  try {
    const userId = String(req.user?._id);
    const isAdmin = Boolean(req.user?.isAdmin);

    const deletedCard = await cardService.deleteCard(
      req.params.id as string,
      userId,
      isAdmin
    );
    res.json({ message: "Card deleted successfully", card: deletedCard });
  } catch (error) {
    next(error);
  }
});

export default router;