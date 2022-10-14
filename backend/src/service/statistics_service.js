export default class StatisticsService {
    
    statistics;
    statisticsStorage;

    constructor(statisticsStorage) {
        this.statisticsStorage = statisticsStorage;
        this.statistics = this.statisticsStorage.getStatistics();
    }

    addClick(name, subscriber) {
        this.statistics.totalClicks++;
        this.statistics.clicks.unshift({
            timestamp: Date.now(),
            name: name,
            subscriber: subscriber
        });

        this.statisticsStorage.updateStatistics(this.statistics);
    }

    getStatistics() {
        return this.statistics;
    }

    removeExpiredClicks(numberOfDays) {
        let tooOld = new Date();
        tooOld.setDate(tooOld.getDate() - numberOfDays);
        tooOld.setUTCHours(0,0,0,0);

        let newClicks = [];
        for (let click of this.statistics.clicks) {
            let clickDate = new Date(click.timestamp);
            if (clickDate < tooOld) {
                break;
            }
            newClicks.push(click);
        }
        this.statistics.clicks = newClicks;
    }
}