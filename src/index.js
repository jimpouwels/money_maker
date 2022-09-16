import config from 'dotenv';
import GmailClient from './gmailClient.js';
import puppeteer from 'puppeteer';
import path from 'path';

config.config();

const gmailClient = new GmailClient();

console.log('---SEARCHING CASH MAILS---');

makeMoney();

async function makeMoney() {
    const cashmails = [];
    await gmailClient.getMessages().then(async messages => {
        for (const message of messages) {
            await gmailClient.getMessage(message.id).then(message => {
                const from = message.payload.headers.find(header => {
                    return header.name === 'From';
                }).value;
                if (from.includes('<noreply@euroclix.nl>') ||
                    from.includes('<info@zinngeld.nl>') ||
                    from.includes('<info@enqueteclub.nl>')) {
                    message.from = from;
                    console.log(`Found cashmail from ${from}`);
                    cashmails.push(message);
                }
            });
        }
    });

    if (cashmails.length === 0) {
        console.log('No cashmails at this time, exiting...');
        process.exit();
    }

    console.log('---SCANNING CASH MAILS FOR URLS---');
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-sandbox",
        ]
    });
    let completedCount = 0;
    let cashUrls = [];
    for (const cashmail of cashmails) {
        console.log(`Searching for links in ${cashmail.from}`);
        let mailBody = '';
        if (cashmail.payload.parts) {
            for (const bodyPart of cashmail.payload.parts) {
                mailBody += Buffer.from(bodyPart.body.data, 'base64').toString();
            }
        } else {
            mailBody = Buffer.from(cashmail.payload.body.data, 'base64').toString();
        }
        const matches = mailBody.matchAll('<a[^>]+href=\"(.*?)\"[^>]*>');
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
                // await page.screenshot({path: path.join(process.cwd(), `/screenshots/${screenshotId}.png`)});
                // console.log(`Taking screenshot for ${cashUrl.from}`);
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
}