import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import ClickNavigationTimedOutError from './error/click_navigation_timed_out_error.js';
import ThreadUtil from '../../util/thread_util.js';

export default class MailClicker {

    browser = null;
    handlers = null;
    mailClient = null;
    statisticsService = null;
    static CLICK_NAVIGATION_TIMEOUT = 30000;

    constructor(handlers, mailClient, statisticsService) {
        this.handlers = handlers;
        this.mailClient = mailClient;
        this.statisticsService = statisticsService;
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
        if (!cashmail.cashUrl) {
            console.log(`No cash URL's were found for cashmail from ${cashmail.from}`);
            return;
        }
        let page = await this.browser.newPage();
        console.log(`\nTrying to open the link '${cashmail.cashUrl}' from ${cashmail.from}`);
        await page.goto(cashmail.cashUrl).then(async () => {
            let startLoop = Date.now();
            const handler = cashmail.handler;
            await handler.performCustomAction(page, this.browser);
            while (!handler.hasRedirected(page)) {
                console.log(`Waiting for page to redirect to target from ${page.url()}`);
                await(ThreadUtil.sleep(1000));
                if ((Date.now() - startLoop) > MailClicker.CLICK_NAVIGATION_TIMEOUT) {
                    throw new ClickNavigationTimedOutError();
                }
            }
            console.log(`Redirected to ${page.url()}`);
            console.log(`Saving statistic`);
            let statisticString = handler.getName();
            if (cashmail.isForwarded) {
                statisticString += ` (forwarded from: ${cashmail.from})`;
            }
            this.statisticsService.addClick(statisticString);
            console.log(`Deleting mail from ${cashmail.from}`);
            this.mailClient.deleteMail(cashmail.id);
        }).catch(error => {
            if (error instanceof ClickNavigationTimedOutError) {
                console.log(`WARNING: Waited ${MailClicker.CLICK_NAVIGATION_TIMEOUT} milliseconds, but the redirect didn't occur`);
            } else {
                console.log(`WARNING: There was an unknown error while navigation: ${error}`);
            }
            console.log(`Timed out waiting for redirect to target, preserving email for review`);
        }).finally(async () => {
            console.log(`Closing all browser pages`);
            let allPages = (await this.browser.pages());
            for (let i = 0; i < allPages.length; i++) {
                let pageToClose = allPages[i];
                // WORKAROUND: Apparently memory is freed up in a faster/better way when navigation
                // to 'about:blank'.
                await pageToClose.goto('about:blank');
                await pageToClose.close();
            }
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