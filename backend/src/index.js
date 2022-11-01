#!/usr/bin/env node

import express from 'express';
import fs from 'fs';
import path from 'path';
import MoneyMakerController from './controller/money_maker_controller.js';
import MoneyMakerService from './service/money_maker/money_maker_service.js';
import config from './../config.js';
import StatisticsController from './controller/statistics_controller.js';
import StatisticsService from './service/statistics_service.js';
import bodyParser from 'body-parser';
import StatisticsStorage from './storage/statistics_storage.js';
import cors from 'cors';
import StateService from './service/state_service.js';
import StateController from './controller/state_controller.js';
import LoggerService from './service/logger_service.js';
import LogController from './controller/log_controller.js';
import PlatformUtil from './util/platform_util.js';

config();

if (PlatformUtil.isDevelopment()) {
    LoggerService.log('Running on Macbook...');
} else {
    LoggerService.log('Running on RaspBerry');
}

var app = express();
app.use(bodyParser.json())
app.use(cors());
const port = process.env.PORT;
app.listen(port, () => {
    LoggerService.log(`[server]: MoneyMakerService is running at https://localhost:${port}`);
});

const forwarders = ['quirinedeloyer_1200@hotmail.com'];

const statisticsService = new StatisticsService(new StatisticsStorage());
const stateService = new StateService();

LoggerService.log('Reading configurations...');
const configs = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')));
const moneyMakerService = new MoneyMakerService(configs, statisticsService, forwarders, stateService);
new MoneyMakerController(app, moneyMakerService, stateService);
new StatisticsController(app, statisticsService);
new StateController(app, stateService);
new LogController(app);