import { Request, Response } from "express";
import handleError from "../../middlewares/handleErrorMiddleware.js";
import * as cardService from "../../services/cardService.js"


export async function postCreateCard(req: Request, res: Response) {
    const { companyId } = res.locals;
    const { employeeId, type } = req.body;

    try {
        await cardService.validateCreation(employeeId, companyId, type);
        await cardService.createCard(employeeId, type);
        res.sendStatus(201);
    } catch (error) {
        return handleError(error, req, res)
    }
}
