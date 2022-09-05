import { Request, Response } from "express";
import handleError from "../../middlewares/handleErrorMiddleware.js";
import * as cardService from "../../services/cardService.js";

export async function getCardInfo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const idTypeNumber = Number(id);

    const balanceAndTransactions = await cardService.getBalanceAndTransactions(
      idTypeNumber
    );
    res.send(balanceAndTransactions).status(200);
  } catch (error) {
    return handleError(error, req, res);
  }
}
