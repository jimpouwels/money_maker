import GmailClient from './gmailClient.js';
import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import EnqueteClubMatcher from './url_matchers/enqueteclubMatcher.js';
import ZinnGeldMatcher from './url_matchers/zinngeldMatcher.js';
import EuroClixMatcher from './url_matchers/euroclixMatcher.js';
import CashbackKortingMatcher from './url_matchers/cashbackkortingMatcher.js';
import LadyCashbackMatcher from './url_matchers/ladycashbackMatcher.js';
import GekkengoudMatcher from './url_matchers/gekkengoudMatcher.js';
import IPayMatcher from './url_matchers/ipayMatcher.js';

if (process.env.MACBOOK === 'true') {
    console.log('Running on Macbook...');
} else {
    console.log('Running on RaspBerry');
}

const configs = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')));
const matchers = [];
matchers.push(new EnqueteClubMatcher());
matchers.push(new ZinnGeldMatcher());
matchers.push(new EuroClixMatcher());
matchers.push(new CashbackKortingMatcher());
matchers.push(new LadyCashbackMatcher());
matchers.push(new GekkengoudMatcher());
matchers.push(new IPayMatcher());

for (const config of configs) {
    makeMoney(config, matchers);
}

async function makeMoney(config, matchers) {
    console.log(`\n---SEARCHING CASH MAILS FOR ${config.userId}---`);

    const client = getClient(config);
    if (!client) {
        console.log(`ERROR: Unknown mail type ${config.type}`);
        return;
    }
    const cashmails = await client.getCashMails(config.labelId).then(async mails => {
        return getMatchingMails(mails, matchers);
    });
    if (cashmails.length === 0) {
        console.log('No cashmails at this time, exiting...');
        process.exit();
    }

    console.log('\n---SCANNING CASH MAILS FOR URLS---');
    let browser = await getBrowserByPlatform();
    let cashUrls = filterCashUrls(cashmails, matchers);

    console.log('\n---CLICKING CASH LINKS, MAKING MONEY!---');
    let completedCount = 0;
    if (cashUrls && cashUrls.length > 0) {
        for (const cashUrl of cashUrls) {
            browseTo(browser, cashUrl);

            const waitingTime = 15000;
            setTimeout(async () => {
                console.log(`Waited ${waitingTime} seconds for page to have redirected successfully...`);
                completedCount++;
            }, waitingTime);
        }
    }

    let intervalId = setInterval(async () => {
        if (completedCount == cashUrls.length) {
            console.log('All cash URLs were handled, closing browser');
            browser.close();

            console.log('\n---DELETE CASH MAILS---');
            deleteMails(client, cashmails);

            clearInterval(intervalId);
        }
    }, 1000);
}

async function getBrowserByPlatform() {
    if (process.env.MACBOOK === 'true') {
        return await puppeteer.launch({
            headless: true,
            args: getBrowserArgs()
        });
    } else {
        return await puppeteerCore.launch({
            headless: true,
            executablePath: "chromium-browser",
            args: getBrowserArgs()
        });
    }
}

function getBrowserArgs() {
    return [
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-sandbox",
    ];
}

function getClient(config) {
    if (config.type === 'gmail') {
        return new GmailClient(config.userId, 
                                config.clientId, 
                                config.clientSecret, 
                                config.refreshToken, 
                                config.redirectUri);
    }
    return null;
}

function getMatchingMails(mails, matchers) {
    const matchingMails = [];
    for (const mail of mails) {
        for (const matcher of matchers) {
            if (matcher.matchFrom(mail.from)) {
                matchingMails.push(mail);
                console.log(`Found cashmail from ${mail.from}`);
                break;
            }
        };
    }
    return matchingMails;
}

function filterCashUrls(cashmails, matchers) {
    let cashUrls = [];
    for (const cashmail of cashmails) {
        console.log(`Searching for links in ${cashmail.from}`);
        const matches = cashmail.body.matchAll('<a[^>]+href=\"(.*?)\"[^>]*>');
        if (matches.length < 1) {
            console.log(`No cashlink found for ${cashmail.from}, did they change the URL format?`);
        }
        urlsLoop: for (const match of matches) {
            const url = match[1];
            matchersLoop: for (const matcher of matchers) {
                if (matcher.matchUrl(url)) {
                    let cashUrl = { url: url.replaceAll('&amp;', '&'), from: cashmail.from };
                    cashUrls.push(cashUrl);
                    console.log(`Found URL ${cashUrl.url} for ${cashUrl.from}`);
                    if (matcher.canHaveMultipleCashUrls()) {
                        break matchersLoop;
                    } else {
                        break urlsLoop;
                    }
                }
            }
        }
    }
    return cashUrls;
}

function deleteMails(client, cashmails) {
    for (const cashmail of cashmails) {
        client.deleteMail(cashmail.id);
        console.log(`Mail from ${cashmail.from} deleted`);
    }
}

async function browseTo(browser, cashUrl) {
    console.log(`Trying to open the link ${cashUrl.url}`);
    const page = await browser.newPage();
    await page.goto(cashUrl.url).catch(_error => {
        console.log('WARNING: The browser was closed while navigating, but probably everyting is OK!');
    });
}