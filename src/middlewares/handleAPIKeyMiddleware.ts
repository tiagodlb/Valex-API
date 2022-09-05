import { Request, Response, NextFunction } from "express";
import * as companiesRepository from "./../repositories/companyRepository.js";
import handleError from "./handleErrorMiddleware.js";

export async function validateAPIKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const apiKey = req.headers["x-api-key"] as string;
    const company = await companiesRepository.findByApiKey(apiKey);
    if (!company)
      throw {
        type: "Unauthorized",
        message: "Incorrect or Inexistent API Key",
      };

    res.locals.companyId = company.id;
    res.locals.apiKey = apiKey;
    return next();
  } catch (error) {
    return handleError(error, req, res);
  }
}
