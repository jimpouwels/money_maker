import { Express, Request, Response } from 'express';
import Click from '../domain/click.js';
import Statistics from '../domain/statistics.js';
import StatisticsService from '../service/statistics_service.js';

export default class StatisticsController {

    constructor(app: Express, statisticsService: StatisticsService) {
        app.get('/statistics', (_req: Request, res: Response) => {
            res.send(this.toStatisticsDto(statisticsService.statistics));
        });
    }

    private toStatisticsDto(statistics: Statistics): any {
        return {
            totalClicks: statistics.totalClicks,
            timestamp: statistics.timestamp,
            clicks: this.toClicksDto(statistics.clicks)
        }
    }

    private toClicksDto(clicks: Click[]): any {
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