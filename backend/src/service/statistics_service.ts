import Click from "../domain/click.js";
import Statistics from "../domain/statistics";
import StatisticsStorage from "../storage/statistics_storage";

export default class StatisticsService {
    
    private _statistics: Statistics;
    private _statisticsStorage: StatisticsStorage;

    constructor(statisticsStorage: StatisticsStorage) {
        this.statisticsStorage = statisticsStorage;
        this.statistics = this.statisticsStorage.getStatistics();
    }

    public addClick(name: string, account: string): void {
        this.statistics.addClick(new Click(Date.now(), name, account));
        this.statisticsStorage.updateStatistics(this.statistics);
    }

    public get statistics(): Statistics {
        return this._statistics;
    }

    public removeExpiredClicks(numberOfDays: number): void {
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

    private get statisticsStorage(): StatisticsStorage {
        return this._statisticsStorage;
    }

    private set statisticsStorage(statisticsStorage: StatisticsStorage) {
        this._statisticsStorage = statisticsStorage;
    }

    private set statistics(statistics: Statistics) {
        this._statistics = statistics;
    }
}