import { Express, Request, Response } from 'express';
import Click from '../domain/click';
import Statistics from '../domain/statistics';
import StatisticsService from '../service/statistics_service';

type StatisticsDto = { timestamp: number, clicks: any, totalClicks: number};
type ClickDto = { timestamp: number, name: string, account: string };

export default class StatisticsController {

    constructor(app: Express, statisticsService: StatisticsService) {
        app.get('/statistics', (_req: Request, res: Response) => {
            res.send(this.toStatisticsDto(statisticsService.statistics));
        });
    }

    private toStatisticsDto(statistics: Statistics): StatisticsDto {
        return {
            totalClicks: statistics.totalClicks,
            timestamp: statistics.timestamp,
            clicks: this.toClicksDto(statistics.clicks)
        }
    }

    private toClicksDto(clicks: Click[]): ClickDto[] {
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