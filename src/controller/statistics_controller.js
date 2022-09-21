export default class StatisticsController {

    constructor(app, statisticsService) {
        app.post('/statistic', (req, res) => {
            console.log(`[/statistic] Post statistic`);
            console.log(req.body);
            res.send();
        });
    }

}