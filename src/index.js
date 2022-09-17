import GmailClient from './gmailClient.js';
import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

if (process.env.MACBOOK === 'true') {
    console.log('Running on Macbook...');
} else {
    console.log('Running on RaspBerry');
}

const configs = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')));

for (const config of configs) {
    makeMoney(config);
}

async function makeMoney(config) {
    console.log(`---SEARCHING CASH MAILS FOR ${config.userId}---`);

    const gmailClient = new GmailClient(config);

    const cashmails = [];
    await gmailClient.getMessages().then(async mails => {
        for (const mail of mails) {
            if (mail.from.includes('<noreply@euroclix.nl>') ||
                mail.from.includes('<info@zinngeld.nl>') ||
                mail.from.includes('<info@enqueteclub.nl>')) {
                console.log(`Found cashmail from ${mail.from}`);
                cashmails.push(mail);
            }
        }
    });

    if (cashmails.length === 0) {
        console.log('No cashmails at this time, exiting...');
        process.exit();
    }

    console.log('---SCANNING CASH MAILS FOR URLS---');
    let browser = await getBrowserByPlatform();    
    let completedCount = 0;
    let cashUrls = [];
    for (const cashmail of cashmails) {
        console.log(`Searching for links in ${cashmail.from}`);
        const matches = cashmail.body.matchAll('<a[^>]+href=\"(.*?)\"[^>]*>');
        if (matches.length < 1) {
            console.log(`No cashlink found for ${cashmail.from}, did they change the URL format?`);
        }
        for (const match of matches) {
            const url = match[1];
            if ((url.includes('enqueteclub') && url.includes('cm-l') && !url.includes('sid='))
                || (url.includes('zinngeld') && url.includes('maillink'))
                || (url.includes('euroclix') && url.includes('reference'))) {
                    let cashUrl = { url: url, from: cashmail.from };
                    cashUrls.push(cashUrl);
                    console.log(`Found URL ${cashUrl.url} for ${cashUrl.from}`);
                    if (url.includes('euroclix')) {
                        // euroclix possibly has multiple url's
                        continue;
                    } else {
                        break;
                    }
                }
        }
    }
    console.log('---CLICKING CASH LINKS, MAKING MONEY!---');
    if (cashUrls && cashUrls.length > 0) {
        for (const cashUrl of cashUrls) {
            console.log(`Trying to open the link ${cashUrl.url}`);
            const page = await browser.newPage();
            await page.goto(cashUrl.url.replaceAll('&amp;', '&'));

            const screenshotId = `${cashUrl.from}-${cashUrls.indexOf(cashUrl)}`;
            setTimeout(async () => {
                console.log('Waited 10 seconds for page to have redirected successfully...');
                completedCount++;
            }, 10000, screenshotId);
        }
    }

    let intervalId = setInterval(async () => {
        if (completedCount == cashUrls.length) {
            console.log('All cash URLs were handled, closing browser');
            browser.close();

            console.log('---DELETE CASH MAILS---');
            for (const cashmail of cashmails) {
                gmailClient.deleteMessage(cashmail.id);
                console.log(`mail from ${cashmail.from} deleted`);
            }

            clearInterval(intervalId);
        }
    }, 1000);

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
}