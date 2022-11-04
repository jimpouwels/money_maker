import Click from "./click";

export default class Statistics {

    private _totalClicks: number;
    private _clicks: Click[] = [];
    private _timestamp: number;

    public static fromJSON(statisticsJSON: any): Statistics {
        const statistics = new Statistics();
        statistics.totalClicks = statisticsJSON.totalClicks;
        statistics.timestamp = statisticsJSON.timestamp;
        for (const click of statisticsJSON.clicks) {
            statistics.clicks.push(new Click(click.timestamp, click.name, click.account));
        }
        return statistics;
    }

    public addClick(click: Click): void {
        this.clicks.unshift(click);
        this.totalClicks = this.totalClicks + 1;
        this.timestamp = Date.now();
    }

    public get totalClicks(): number {
        return this._totalClicks;
    }

    public set totalClicks(totalClicks: number) {
        this._totalClicks = totalClicks;
    }

    public get clicks(): Click[] {
        return this._clicks;
    }

    public set clicks(clicks: Click[]) {
        this._clicks = clicks;
    }

    public get timestamp(): number {
        return this._timestamp;
    }

    public set timestamp(timestamp: number) {
        this._timestamp = timestamp;
    }

}