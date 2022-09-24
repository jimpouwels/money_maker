import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

export default class MailClicker {

    browser = null;
    matchers = null;
    mailClient = null;

    constructor(matchers, mailClient) {
        this.matchers = matchers;
        this.mailClient = mailClient;
    }

    async click(cashmail) {
        if (!this.browser) {
            this.browser = await this.getBrowserByPlatform();
        }
        if (cashmail.cashUrls.length == 0) {
            console.log(`No cash URL's were found for cashmail from ${cashmail.from}`);
            return;
        }
        let clickFailed = false;
        for (const cashUrl of cashmail.cashUrls) {
            let page = await this.browser.newPage();
            console.log(`\nTrying to open the link ${cashUrl.url}`);
            await page.goto(cashUrl.url).then(async () => {
                let startLoop = Date.now();
                while (this.matchers.filter(m => m.hasDomain(page.url())).length > 0) {
                    console.log(`Waiting for page to redirect to target from ${page.url()}`);
                    await(this.sleep(1000));
                    if ((Date.now() - startLoop) > 30000) {
                        clickFailed = true;
                        break;
                    }
                }
                if (!clickFailed) {
                    console.log(`Redirected to ${page.url()}`);
                } else {
                    console.log(`Timed out waiting for redirect to target`);
                }
            }).catch(error => {
                console.log(`WARNING: There was an error while navigation: ${error}`);
                clickFailed = true;
            }).finally(async () => {
                console.log(`Closing browser page`);
                await page.close();
            });
        }
        if (!clickFailed) {
            console.log(`Deleting mail from ${cashmail.from}`);
            this.mailClient.deleteMail(cashmail.id);
        } else {
            console.log(`At least 1 click in this mail failed, preserving email for review`);
        }
    }

    async sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async getBrowserByPlatform() {
        const xcsrftoken = await xcsrftoken();
        const cookies = JSON.parse(process.env.cookies);
        if (process.env.MACBOOK === 'true') {
            return await puppeteer.launch({
                headless: true,
                args: this.getBrowserArgs()
            });
        } else {
            return await puppeteerCore.launch({
                headless: true,
                args: this.getBrowserArgs()
            });
        }
    }

    getBrowserArgs() {
        return [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-sandbox",
        ];
    }

}