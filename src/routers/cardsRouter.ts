import { Router } from "express";
import { postCreateCard } from "../controllers/cards/creationController.js";
import { validateAPIKey } from "./../middlewares/handleAPIKeyMiddleware.js"
import { validateSchemaMiddleware } from "../middlewares/handleSchemaMiddleware.js"
import { cardSchema } from "../schemas/cardSchema.js";

const cardRouter = Router();

cardRouter.post("/card", validateSchemaMiddleware(cardSchema), validateAPIKey, postCreateCard);

export default cardRouter; 