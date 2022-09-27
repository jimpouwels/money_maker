import path from 'path';
import fs from 'fs';
import Statistics from '../domain/statistics.js';

export default class StatisticsStorage {

    constructor() {
        if (!fs.existsSync(path.join(process.cwd(), 'statistics.json'))) {
            this.updateStatistics(new Statistics());
        }
    }

    getStatistics() {
        return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'statistics.json')));
    }

    updateStatistics(statistics) {
        fs.writeFileSync(path.join(process.cwd(), 'statistics.json'), JSON.stringify(statistics));
    }

}