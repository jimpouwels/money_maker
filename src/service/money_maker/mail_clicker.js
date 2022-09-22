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
        console.log(`\nTrying to open the link ${cashUrl.url}`);
        await page.goto(cashUrl.url)
            .then(async () => {
                let startLoop = Date.now();
                let clickFailed = false;
                while (this.matchers.filter(m => m.hasDomain(page.url())).length > 0) {
                    console.log(`Waiting for page to redirect away from ${page.url()}`);
                    await(this.sleep(1000));
                    if ((Date.now() - startLoop) > 30000) {
                        clickFailed = true;
                        break;
                    }
                }
                if (!clickFailed) {
                    console.log(`Redirected to ${page.url()}`);
                    console.log(`Deleting mail from ${cashUrl.originatingMail.from}`);
                    this.mailClient.deleteMail(cashUrl.originatingMail.id);
                }
                console.log(`Closing browser page`);
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