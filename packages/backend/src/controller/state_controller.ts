import { Express, Request, Response } from 'express';
import StateService from '../service/state_service';
export default class StateController {

    constructor(app: Express, stateService: StateService) {
        app.get('/state', (_req: Request, res: Response) => {
            res.send({
                state: stateService.state,
                text: stateService.text 
            });
        });
    }

}