import { Router } from "express";
import { postCreateCard } from "../controllers/cards/creationController.js";
import { putActivateCard } from "../controllers/cards/activationController.js";
import { getCardInfo } from "../controllers/cards/balanceController.js";
import { putBlockCard, putUnblockCard } from "../controllers/cards/blockageController.js";
import { validateAPIKey } from "./../middlewares/handleAPIKeyMiddleware.js";
import { validateSchemaMiddleware } from "../middlewares/handleSchemaMiddleware.js";
import { cardSchema, activationCardSchema, blockCardSchema } from "../schemas/cardSchema.js";

const cardRouter = Router();

cardRouter.post(
  "/card",
  validateSchemaMiddleware(cardSchema),
  validateAPIKey,
  postCreateCard
);
cardRouter.put(
  "/card/activate",
  validateSchemaMiddleware(activationCardSchema),
  validateAPIKey,
  putActivateCard
);
cardRouter.get("/balance/:id", validateAPIKey, getCardInfo);
cardRouter.put('/lock', validateSchemaMiddleware(blockCardSchema), putBlockCard);
cardRouter.put('/unlock', validateSchemaMiddleware(blockCardSchema), putUnblockCard);

export default cardRouter;
 