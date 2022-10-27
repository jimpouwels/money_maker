import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import ClickNavigationTimedOutError from './error/click_navigation_timed_out_error.js';
import ThreadUtil from '../../util/thread_util.js';
import LoggerService from '../logger_service.js';
import PlatformUtil from '../../util/platform_util.js';
import ZinnGeldHandler from './handlers/zinngeld_handler.js';
import { TimeoutError } from 'puppeteer-core';

export default class MailClicker {

    browser;
    handlers;
    mailClient;
    statisticsService;
    stateService;
    static CLICK_NAVIGATION_TIMEOUT = 30000;

    constructor(handlers, mailClient, statisticsService, stateService) {
        this.handlers = handlers;
        this.mailClient = mailClient;
        this.statisticsService = statisticsService;
        this.stateService = stateService;
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
            LoggerService.log(`No cash URL's were found for cashmail from ${cashmail.from}`);
            return;
        }
        let page = await this.browser.newPage();
        LoggerService.log(`\nTrying to open the link '${cashmail.cashUrl}' from ${cashmail.from}`);
        await page.goto(cashmail.cashUrl).then(async () => {
            let startLoop = Date.now();
            const handler = cashmail.handler;
            this.stateService.setText(`Clicking cashmail from ${handler.name}`)
            await handler.performCustomAction(page, this.browser);
            while (!handler.hasRedirected(page)) {
                LoggerService.log(`Waiting for page to redirect to target from ${page.url()}`);
                await(ThreadUtil.sleep(1000));
                if ((Date.now() - startLoop) > MailClicker.CLICK_NAVIGATION_TIMEOUT) {
                    throw new ClickNavigationTimedOutError();
                }
            }
            this.resolveClick(page, cashmail);
        }).catch(error => {
            if (error instanceof ClickNavigationTimedOutError) {
                LoggerService.log(`WARNING: Waited ${MailClicker.CLICK_NAVIGATION_TIMEOUT} milliseconds, but the redirect didn't occur`);
            } else if (error instanceof TimeoutError && cashmail.handler instanceof ZinnGeldHandler) {
                LoggerService.log(`ZinnGeld timeout, which tends to happen from time to time, assuming clicking is successful`);
                this.resolveClick(page, cashmail);
            } else {
                LoggerService.log(`WARNING: There was an unknown error while navigation: ${error}`);
            }
            LoggerService.log(`Timed out waiting for redirect to target, preserving email for review`);
        }).finally(async () => {
            LoggerService.log(`Closing all browser pages`);
            let allPages = (await this.browser.pages());
            for (let i = 0; i < allPages.length; i++) {
                let pageToClose = allPages[i];
                // WORKAROUND: Apparently memory is freed up in a faster/better way when navigation
                // to 'about:blank'.
                try {
                    await pageToClose.goto('about:blank');
                } catch (error) {
                    LoggerService.logError(`WARNING: An error occurred when navigating to about:blank before closing the tab`, error);
                }
                await pageToClose.close();
            }
        });
    }

    resolveClick(page, cashmail) {
        LoggerService.log(`Redirected to ${page.url()}`);
        LoggerService.log(`Saving statistic`);

        this.statisticsService.addClick(cashmail.handler.getName(), cashmail.account);

        this.stateService.setText(`Deleting mail from ${cashmail.handler.name}`)
        if (!PlatformUtil.isDevelopment()) {
            LoggerService.log(`Deleting mail from ${cashmail.from}`);
            this.mailClient.deleteMail(cashmail.id);
        }
    }

    async getBrowserByPlatform() {
        if (PlatformUtil.isDevelopment()) {
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