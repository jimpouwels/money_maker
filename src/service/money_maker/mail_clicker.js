import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';

export default class MailClicker {

    browser = null;
    handlers = null;
    mailClient = null;

    constructor(handlers, mailClient) {
        this.handlers = handlers;
        this.mailClient = mailClient;
    }

    async openBrowser() {
        if (this.browser) {
            await this.closeBrowser();
        }
        this.browser = await this.getBrowserByPlatform();
    }

    async closeBrowser() {
        await this.browser.close();
    }

    async click(cashmail) {
        if (cashmail.cashUrls.length == 0) {
            console.log(`No cash URL's were found for cashmail from ${cashmail.from}`);
            return;
        }
        let clickFailed = false;
        for (const cashUrl of cashmail.cashUrls) {
            let page = await this.browser.newPage();
            console.log(`\nTrying to open the link ${cashUrl}`);
            await page.goto(cashUrl).then(async () => {
                let startLoop = Date.now();
                const handler = cashmail.handler;
                await handler.performCustomAction(page, this.browser);
                while (!handler.hasRedirected(page)) {
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
                console.log(`Closing all browser pages`);
                for (let i = 0; i < this.browser.pages().length; i++) {
                    await this.browser.pages()[i].close();
                }
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
        if (process.env.MACBOOK === 'true') {
            return await puppeteer.launch({
                headless: true,
                args: this.getBrowserArgs()
            });
        } else {
            return await puppeteerCore.launch({
                headless: true,
                executablePath: '/usr/bin/chromium-browser',
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