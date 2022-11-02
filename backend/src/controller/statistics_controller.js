import Flattener from "../util/flattener.js";

export default class StatisticsController {

    constructor(app, statisticsService) {
        app.get('/statistics', (_req, res) => {
            res.send(Flattener.flattenStatistics(statisticsService.statistics));
        });
    }

}