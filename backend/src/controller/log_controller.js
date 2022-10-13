import LoggerService from "../service/logger_service.js";

export default class LogController {

    constructor(app) {
        app.get('/log', async (_req, res) => {
            res.send(LoggerService.getLines());
        });
    }

}