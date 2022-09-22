import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

export default class MailClicker {

    $browser = null;
    $page = null;

    async clickLinks(links) {
        for (const link of links) {
            await this.browseTo(link);
        }
    }

    async browseTo(cashUrl) {
        if (!this.browser) {
            this.browser = await this.getBrowserByPlatform();
            this.page = await this.browser.newPage();
        }
        const waitingTime = 15000;
        console.log(`Trying to open the link ${cashUrl.url}`);
        await this.page.goto(cashUrl.url)
            .then(async () => {
                console.log(`Waiting ${waitingTime} seconds for page to have redirected successfully...`);
                await this.sleep(waitingTime);
            })
            .catch(_error => {
                console.log('WARNING: The browser was closed while navigating, but probably everyting is OK!');
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