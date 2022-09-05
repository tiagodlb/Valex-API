import { Router } from 'express';
import { putPurchase, putPurchaseOnline } from '../controllers/purchases/purchaseController.js' 
import { validateSchemaMiddleware } from '../middlewares/handleSchemaMiddleware.js';
import { purchaseSchema, onlinePurchaseSchema } from '../schemas/purchaseSchema.js';

const purchaseRouter = Router();

purchaseRouter.put('/transaction/:cardId', validateSchemaMiddleware(purchaseSchema), putPurchase)
purchaseRouter.put('/transaction/:cardId/online', validateSchemaMiddleware(onlinePurchaseSchema), putPurchaseOnline)

export default purchaseRouter;