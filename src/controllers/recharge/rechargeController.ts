import { Request, Response } from "express";
import handleError from "../../middlewares/handleErrorMiddleware.js";
import * as rechargeService from "../../services/rechargeService.js"


export async function putRecharge(req: Request, res: Response) {
    const { amount } = req.body;
    const { cardId } = req.params;
    const idTypeNumber = Number(cardId);

    try {
        await rechargeService.rechargeCard(idTypeNumber, amount)
        res.sendStatus(204);
    } catch (error) {
        return handleError(error, req, res)
    }
}
