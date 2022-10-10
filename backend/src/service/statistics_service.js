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
        if (this.statistics.clicks.length > 100) {
            this.statistics.clicks.length = 100;
        }
        this.statisticsStorage.updateStatistics(this.statistics);
    }

    getStatistics() {
        return this.statistics;
    }
}