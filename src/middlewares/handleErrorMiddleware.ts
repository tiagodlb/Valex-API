import { Request, Response } from "express";

export default function handleError(error: {type: string, message: string}, req: Request,res: Response){
    if(error.type === 'Bad_Request') return res.status(400).send(error.message);
    if(error.type === 'Unauthorized') return res.status(401).send(error.message)
    if(error.type === 'not_found') return res.status(404).send(error.message);
    if(error.type === 'conflict') return res.status(409).send(error.message);
    
    res.sendStatus(500);
}