export default class StatisticsController {

    constructor(app, statisticsService) {
        app.get('/statistics', (req, res) => {
            let statistics = statisticsService.getStatistics();
            let displayString = "";
            displayString += `Total clicks: ${statistics.totalClicks}<br /><br />`;
            displayString += `Last ${statistics.clicks.length} clicks:<br />`;
            displayString += `<hr /><br />`;
            for (const click of statistics.clicks) {
                displayString += `${new Date(click.timestamp).toISOString()}: ${click.name.replace('<', '&lt;').replace('>', '&gt;')}<br />`;
            }
            res.send(displayString);
        });

        app.get('/statistics_new', (req, res) => {
            res.send(statisticsService.getStatistics());
        });
    }

}