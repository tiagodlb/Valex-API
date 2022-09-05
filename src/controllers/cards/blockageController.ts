import { Request, Response } from "express";
import handleError from "../../middlewares/handleErrorMiddleware.js";
import * as cardService from "../../services/cardService.js"


export async function putBlockCard(req: Request, res: Response) {
    const { password, cardId } = req.body;

    try {
        await cardService.blockCard(cardId, password);
        res.sendStatus(204);
    } catch (error) {
        return handleError(error, req, res)
    }
}

export async function putUnblockCard(req: Request, res: Response) {
    const { password, cardId } = req.body;

    try {
        await cardService.unblockCard(cardId, password);
        res.sendStatus(204);
    } catch (error) {
        return handleError(error, req, res)
    }
}