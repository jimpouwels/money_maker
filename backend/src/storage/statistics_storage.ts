import path from 'path';
import fs from 'fs';
import Statistics from '../domain/statistics.js';
import Click from '../domain/click.js';
import Flattener from '../util/flattener.js';

export default class StatisticsStorage {

    public constructor() {
        if (!fs.existsSync(path.join(process.cwd(), 'statistics.json'))) {
            this.updateStatistics(new Statistics());
        }
    }

    public getStatistics(): Statistics {
        const loadedStatistics = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'statistics.json')).toString());
        return Statistics.fromJSON(loadedStatistics);
    }

    public updateStatistics(statistics: Statistics): void {
        fs.writeFileSync(path.join(process.cwd(), 'statistics.json'), JSON.stringify(Flattener.flattenStatistics(statistics)));
    }

    
}