import Click from "./click";

export default class Statistics {

    private _totalClicks: number = 0;
    private _clicks: Click[] = [];
    private _timestamp: number = 0;

    public addClick(click: Click): void {
        this._clicks.unshift(click);
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