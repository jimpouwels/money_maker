import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

export default class MailClicker {

    $browser = null;

    async clickLinks(links) {
        for (const link of links) {
            await this.browseTo(link);
        }
    }

    async browseTo(cashUrl) {
        if (!this.browser) {
            this.browser = await this.getBrowserByPlatform();
        }
        const waitingTime = 15000;
        console.log(`Trying to open the link ${cashUrl.url}`);
        const page = await browser.newPage();
        await page.goto(cashUrl.url)
            .then(async () => {
                await this.sleep(waitingTime);
                console.log(`Waited ${waitingTime} seconds for page to have redirected successfully...`);
                // await page.screenshot({path: path.join(process.cwd(), `/screenshots/${cashUrl.from}.png`)});
                console.log('Closing page');
                await page.close();
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