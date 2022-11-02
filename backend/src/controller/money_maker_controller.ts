import { Express, Request, Response } from 'express';
import MoneyMakerService from '../service/money_maker/money_maker_service';
import StateService from '../service/state_service';
export default class MoneyMakerController {

    constructor(app: Express, moneyMakerService: MoneyMakerService, stateService: StateService) {
        app.post('/make_money', async (_req: Request, res: Response) => {
            if (!stateService.isRunning()) {
                console.log(`[/make_money] Starting to make money!`);
                moneyMakerService.makeMoney();
            } else {
                console.log('MoneyMaker is already running...');
            }
            res.end();
        });
    }

}