import { Router } from 'express';
import { rechargeSchema } from '../schemas/rechargeSchema.js'
import { validateAPIKey } from '../middlewares/handleAPIKeyMiddleware.js';
import {validateSchemaMiddleware} from "../middlewares/handleSchemaMiddleware.js";
import { putRecharge } from '../controllers/recharge/rechargeController.js';

const rechargeRouter = Router();

rechargeRouter.put('/recharge/:cardId', validateSchemaMiddleware(rechargeSchema), validateAPIKey, putRecharge);

export default rechargeRouter;