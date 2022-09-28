export default class StatisticsController {

    constructor(app, statisticsService) {
        app.get('/statistics', (req, res) => {
            console.log(`[/statistic] Post statistic`);
            console.log(req.body);
            let statistics = statisticsService.getStatistics();
            let displayString = "";
            displayString += `Total clicks: ${statistics.totalClicks}<br /><br />`;
            displayString += `Last ${statistics.clicks.length} clicks:<br />`;
            displayString += `-----------------------------------:<br />`;
            for (const click of statistics.clicks.slice().reverse()) {
                displayString += `${new Date(click.timestamp).toISOString()}: ${click.name}<br />`;
            }
            res.send(displayString);
        });
    }

}