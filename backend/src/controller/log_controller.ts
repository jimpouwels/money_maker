import { Express, Request, Response } from 'express';
import LoggerService from "../service/logger_service";

export default class LogController {

    public constructor(app: Express) {
        app.get('/log', async (_req: Request, res: Response) => {
            res.send(LoggerService.getLines());
        });
    }

}