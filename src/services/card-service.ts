import { type Card as CardRequest } from "../validations/card.ts";
import { CardModel } from "../database/models.ts";
import { logger } from "../logger/logger.ts";
import { NotFoundError, HttpError } from "../error/custom-error.ts";
import mongoose from "mongoose";

const cardService = {
  getCards: async () => {
    const cards = await CardModel.find();
    return cards;
  },

  getCard: async (cardId: string) => {
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      logger.error("[getCard]: Invalid Card ID format");
      throw new NotFoundError("No such card found");
    }

    const card = await CardModel.findById(cardId);
    if (!card) {
      logger.error("[getCard]: No such card found");
      throw new NotFoundError("No such card found");
    }
    return card;
  },

  getMyCards: async (userId: string) => {
    const cards = await CardModel.find({ userId: String(userId) });
    return cards;
  },

  createCard: async (cardData: CardRequest, userId: string) => {
    let bizNumber = Math.floor(Math.random() * 1_000_000);

    while (await CardModel.findOne({ bizNumber })) {
      bizNumber = Math.floor(Math.random() * 1_000_000);
    }

    const savedCard = await CardModel.create({
      ...cardData,
      userId: String(userId),
      bizNumber,
    });

    return savedCard;
  },

  updateCard: async (cardId: string, cardData: CardRequest, userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      logger.error("[updateCard]: Invalid Card ID format");
      throw new NotFoundError("No such card found");
    }

    const card = await CardModel.findById(cardId);
    if (!card) {
      logger.error("[updateCard]: No such card found");
      throw new NotFoundError("No such card found");
    }

    const cardOwnerId = String(card.userId);
    if (cardOwnerId !== String(userId)) {
      logger.error("[updateCard]: Unauthorized card update attempt");
      throw new HttpError("You can only update your own cards", 403);
    }

    const updatedCard = await CardModel.findByIdAndUpdate(cardId, cardData, {
      new: true,
    });
    return updatedCard;
  },

  logLikes: async (cardId: string, userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      logger.error("[logLikes]: Invalid Card ID format");
      throw new NotFoundError("No such card found");
    }

    const card = await CardModel.findById(cardId);
    if (!card) {
      logger.error("[logLikes]: No such card found");
      throw new NotFoundError("No such card found");
    }

    const normalizedUserId = String(userId);
    const likesArray = (card.likes || []).map((id) => String(id));
    const hasLiked = likesArray.includes(normalizedUserId);

    const updateQuery = hasLiked
      ? { $pull: { likes: normalizedUserId } }
      : { $addToSet: { likes: normalizedUserId } };

    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId,
      updateQuery,
      { new: true }
    );

    return updatedCard;
  },

  changeBusinessNumber: async (cardId: string, bizNumber: number) => {
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      logger.error("[changeBusinessNumber]: Invalid Card ID format");
      throw new NotFoundError("No such card found");
    }

    const numericBizNumber = Number(bizNumber);
    if (isNaN(numericBizNumber)) {
      throw new HttpError("Invalid business number format", 400);
    }

    const existingCard = await CardModel.findOne({
      bizNumber: numericBizNumber,
      _id: { $ne: cardId },
    });

    if (existingCard) {
      logger.error("[changeBusinessNumber]: Biz number already in use");
      throw new HttpError("Biz number already taken", 400);
    }

    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId,
      { bizNumber: numericBizNumber },
      { new: true }
    );

    if (!updatedCard) {
      logger.error("[changeBusinessNumber]: No such card found");
      throw new NotFoundError("No such card found");
    }

    return updatedCard;
  },

  deleteCard: async (cardId: string, userId: string, isAdmin: boolean = false) => {
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      logger.error("[deleteCard]: Invalid Card ID format");
      throw new NotFoundError("No such card found");
    }

    const card = await CardModel.findById(cardId);
    if (!card) {
      logger.error("[deleteCard]: No such card found");
      throw new NotFoundError("No such card found");
    }

    const cardOwnerId = String(card.userId);
    const requestingUserId = String(userId);
    const userIsAdmin = Boolean(isAdmin);

    if (cardOwnerId !== requestingUserId && !userIsAdmin) {
      logger.error("[deleteCard]: Unauthorized card deletion attempt");
      throw new HttpError(
        "Only the card owner or an admin can delete this card",
        403
      );
    }

    const deletedCard = await CardModel.findByIdAndDelete(cardId);
    return deletedCard;
  },
};

export default cardService;