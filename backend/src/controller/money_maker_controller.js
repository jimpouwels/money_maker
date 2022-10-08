export default class MoneyMakerController {

    constructor(app, moneyMakerService) {
        app.post('/make_money', async (_req, res) => {
            console.log(`[/make_money] Starting to make money!`);
            moneyMakerService.makeMoney();
            res.end();
        });
    }

}