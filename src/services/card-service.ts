import { type Card as CardRequest } from "../validations/card.ts";
import { CardModel } from "../database/models.ts";
import { logger } from "../logger/logger.ts";
import { NotFoundError, HttpError } from "../error/custom-error.ts";

const cardService = {
  getCards: async () => {
    const cards = await CardModel.find();
    return cards;
  },

  getCard: async (cardId: string) => {
    const card = await CardModel.findById(cardId);
    if (!card) {
      logger.error("[getCard]: No such card found");
      throw new NotFoundError("No such card found");
    }
    return card;
  },

  getMyCards: async (userId: string) => {
    const card = await CardModel.find({ userId });
    return card;
  },

  createCard: async (cardData: CardRequest, userId: string) => {
    let bizNumber = Math.floor(Math.random() * 1_000_000);

    while (await CardModel.findOne({ bizNumber })) {
      bizNumber = Math.floor(Math.random() * 1_000_000);
    }

    const card = new CardModel({
      ...cardData,
      userId,
      bizNumber,
    });

    const savedCard = await card.save();
    return savedCard;
  },

  updateCard: async (cardId: string, cardData: CardRequest, userId: string) => {
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

    const updatedCard = await CardModel.findByIdAndUpdate(cardId, cardData, { new: true });
    if (!updatedCard) {
      throw new NotFoundError("No such card found");
    }
    return updatedCard;
  },

  logLikes: async (cardId: string, userId: string) => {
    const card = await CardModel.findById(cardId);
    if (!card) {
      logger.error("[logLikes]: No such card found");
      throw new NotFoundError("No such card found");
    }

    const currentLikes = (card.likes || []).map((id) => String(id));
    const index = currentLikes.indexOf(String(userId));

    const update = index === -1
      ? { $addToSet: { likes: userId } }
      : { $pull: { likes: userId } };

    const savedCard = await CardModel.findByIdAndUpdate(cardId, update, { new: true });
    return savedCard;
  },

  changeBusinessNumber: async (cardId: string, bizNumber: number) => {
    const existingCard = await CardModel.findOne({ bizNumber });
    if (existingCard) {
      logger.error("[changeBusinessNumber]: Biz number already in use");
      throw new HttpError("Biz number already taken", 400);
    }

    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId,
      { bizNumber },
      { new: true }
    );

    if (!updatedCard) {
      logger.error("[changeBusinessNumber]: No such card found");
      throw new NotFoundError("No such card found");
    }

    return updatedCard;
  },

  deleteCard: async (cardId: string, userId: string, isAdmin: boolean) => {
    const card = await CardModel.findById(cardId);
    if (!card) {
      logger.error("[deleteCard]: No such card found");
      throw new NotFoundError("No such card found");
    }

    const cardOwnerId = String(card.userId);
    if (cardOwnerId !== String(userId) && !isAdmin) {
      logger.error("[deleteCard]: Unauthorized card deletion attempt");
      throw new HttpError("Only the card owner or an admin can delete this card", 403);
    }

    const deletedCard = await CardModel.findByIdAndDelete(cardId);
    return deletedCard;
  },
};

export default cardService;