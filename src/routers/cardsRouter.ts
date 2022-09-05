import { Router } from "express";
import { postCreateCard } from "../controllers/cards/creationController.js";
import { putActivateCard } from "../controllers/cards/activationController.js";
import { validateAPIKey } from "./../middlewares/handleAPIKeyMiddleware.js"
import { validateSchemaMiddleware } from "../middlewares/handleSchemaMiddleware.js"
import { cardSchema, activationCardSchema } from "../schemas/cardSchema.js";

const cardRouter = Router();

cardRouter.post("/card", validateSchemaMiddleware(cardSchema), validateAPIKey, postCreateCard);
cardRouter.put("/card/activate", validateSchemaMiddleware(activationCardSchema), validateAPIKey, putActivateCard);

export default cardRouter; 