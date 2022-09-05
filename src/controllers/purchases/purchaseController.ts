import { Request, Response } from "express";
import handleError from "../../middlewares/handleErrorMiddleware.js";
import * as purchaseService from "../../services/purchaseService.js";

export async function putPurchase(req: Request, res: Response) {
  try {
    const { cardId } = req.params;
    const cardIdTypeNumber = Number(cardId);
    const { password, businessId, amount } = req.body;

    await purchaseService.createTransaction(
      cardIdTypeNumber,
      password,
      businessId,
      amount
    );
    res.sendStatus(204);
  } catch (error) {
    return handleError(error, req, res);
  }
}

export async function putPurchaseOnline(req: Request, res: Response) {
  try {
    const { cardId } = req.params;
    const cardIdTypeNumber = Number(cardId);
    const { name, expirationDate, cardNumber, businessId, amount } = req.body;

    await purchaseService.createOnlineTransaction(
      cardIdTypeNumber,
      businessId,
      amount,
      name,
      cardNumber,
      expirationDate
    );

    res.sendStatus(204);
  } catch (error) {
    return handleError(error, req, res);
  }
}
