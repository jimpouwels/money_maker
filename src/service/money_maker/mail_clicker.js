import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

export default class MailClicker {

    $browser = null;
    $matchers = null;

    constructor(matchers) {
        this.matchers = matchers;
    }

    async clickLinks(links) {
        for (const link of links) {
            await this.browseTo(link);
        }
    }

    async browseTo(cashUrl) {
        if (!this.browser) {
            this.browser = await this.getBrowserByPlatform();
        }
        let page = await this.browser.newPage();
        const waitingTime = 20000;
        console.log(`Trying to open the link ${cashUrl.url}`);
        await page.goto(cashUrl.url)
            .then(async () => {
                while (this.matchers.filter(m => m.hasDomain(page.url())).length > 0) {
                    console.log(`Waiting for page to redirect away from ${page.url()}`);
                    await(this.sleep(1000));
                }
                console.log(`Redirected to ${page.url()}, closing page...`);
                await page.close();
            }).catch(error => {
                console.log(`WARNING: There was an error while navigation: ${error}`);
            });
    }

    async sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async getBrowserByPlatform() {
        if (process.env.MACBOOK === 'true') {
            return await puppeteer.launch({
                headless: true,
                args: this.getBrowserArgs()
            });
        } else {
            return await puppeteerCore.launch({
                headless: true,
                executablePath: "chromium-browser",
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