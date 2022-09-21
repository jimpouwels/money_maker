#!/usr/bin/env node

import express from 'express';
import fs from 'fs';
import path from 'path';
import MoneyMakerController from './controller/money_maker_controller.js';
import MoneyMakerService from './service/money_maker/money_maker_service.js';
import config from './../config.js';

if (process.env.MACBOOK === 'true') {
    console.log('Running on Macbook...');
} else {
    console.log('Running on RaspBerry');
}

var app = express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`[server]: MoneyMakerService is running at https://localhost:${port}`);
});

console.log('Reading configurations...')
const configs = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')));
const moneyMakerService = new MoneyMakerService(configs);
new MoneyMakerController(app, moneyMakerService);