export default class StatisticsController {

    constructor(app, statisticsService) {
        app.get('/statistics', (_req, res) => {
            res.send(statisticsService.getStatistics());
        });
    }

}