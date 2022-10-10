export default class MoneyMakerController {

    constructor(app, moneyMakerService, stateService) {
        app.post('/make_money', async (_req, res) => {
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