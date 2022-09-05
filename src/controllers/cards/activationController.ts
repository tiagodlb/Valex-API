import { Request, Response } from "express";
import handleError from "../../middlewares/handleErrorMiddleware.js";
import * as cardService from "../../services/cardService.js"


export async function putActivateCard(req: Request, res: Response) {
    const { securityCode, password, originalCardId } = req.body;

    try {
        await cardService.activateCard(securityCode, password, originalCardId);
        res.sendStatus(204);
    } catch (error) {
        return handleError(error, req, res)
    }
}