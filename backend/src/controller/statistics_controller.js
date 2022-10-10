export default class StatisticsController {

    constructor(app, statisticsService) {
        app.get('/statistics', (req, res) => {
            res.send(statisticsService.getStatistics());
        });
    }

}