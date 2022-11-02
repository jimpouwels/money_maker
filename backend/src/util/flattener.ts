import Click from "../domain/click";
import Statistics from "../domain/statistics";

export default class Flattener {
    
    public static flattenStatistics(statistics: Statistics): any {
        return {
            totalClicks: statistics.totalClicks,
            timestamp: statistics.timestamp,
            clicks: this.flattenClicks(statistics.clicks)
        }
    }

    public static flattenClicks(clicks: Click[]): any {
        const flattenedClicks = [];
        for (const click of clicks) {
            flattenedClicks.push({
                timestamp: click.timestamp,
                name: click.name,
                account: click.account
            })
        }
        return flattenedClicks;
    }

}