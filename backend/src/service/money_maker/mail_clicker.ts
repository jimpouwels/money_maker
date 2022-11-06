import * as puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import ClickNavigationTimedOutError from './error/click_navigation_timed_out_error';
import ThreadUtil from '../../util/thread_util';
import LoggerService from '../logger_service';
import PlatformUtil from '../../util/platform_util';
import ZinnGeldHandler from './handlers/zinngeld_handler';
import Url from '../../domain/url';
import Handler from './handlers/handler';
import GmailClient from '../../clients/gmail_client';
import StatisticsService from '../statistics_service';
import StateService from '../state_service';
import Mail from '../../domain/mail';

export default class MailClicker {

    private _browser: any;
    private _handlers: Handler[];
    private _mailClient: GmailClient;
    private _statisticsService: StatisticsService;
    private _stateService: StateService;
    private static CLICK_NAVIGATION_TIMEOUT: number = 30000;

    public constructor(handlers: Handler[], mailClient: GmailClient, statisticsService: StatisticsService, stateService: StateService) {
        this.handlers = handlers;
        this.mailClient = mailClient;
        this.statisticsService = statisticsService;
        this.stateService = stateService;
    }

    public async openBrowser(): Promise<void> {
        if (this.browser) {
            await this.closeBrowser();
        }
        this.browser = await this.getBrowserByPlatform();
    }

    public async closeBrowser(): Promise<void> {
        return this.browser.close();
    }

    public async click(cashmail: Mail): Promise<void> {
        if (!cashmail.cashUrl) {
            LoggerService.log(`No cash URL's were found for cashmail from ${cashmail.from}`);
            return;
        }
        let page = await this.browser.newPage();
        LoggerService.log(`\nTrying to open the link '${cashmail.cashUrl.full}' from ${cashmail.from}`);
        await page.goto(cashmail.cashUrl.full, { waitUntil: 'networkidle2', timeout: 0 }).then(async () => {
            let startLoop = Date.now();
            const handler = cashmail.handler;
            this.stateService.text = `Clicking cashmail from ${handler.name}`;
            await handler.performCustomAction(page, cashmail.cashUrl, this.browser);
            while (!handler.hasRedirected(Url.parse(page.url()))) {
                LoggerService.log(`Waiting for page to redirect to target from ${page.url()}`);
                await(ThreadUtil.sleep(1000));
                if ((Date.now() - startLoop) > MailClicker.CLICK_NAVIGATION_TIMEOUT) {
                    throw new ClickNavigationTimedOutError();
                }
            }
            this.resolveClick(page, cashmail);
        }).catch((error: any) => {
            if (error instanceof ClickNavigationTimedOutError) {
                LoggerService.log(`WARNING: Waited ${MailClicker.CLICK_NAVIGATION_TIMEOUT} milliseconds, but the redirect didn't occur`);
            } else if (/* error instanceof TimeoutError && */cashmail.handler instanceof ZinnGeldHandler) {
                LoggerService.log(`ZinnGeld timeout, which tends to happen from time to time, assuming clicking is successful`);
                this.resolveClick(page, cashmail);
                return;
            } else {
                LoggerService.logError(`WARNING: There was an unknown error while navigating: ${error}`, error);
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
                    await pageToClose.goto('about:blank', { waitUntil: 'networkidle2', timeout: 0 });
                } catch (error: any) {
                    LoggerService.logError(`WARNING: An error occurred when navigating to about:blank and closing the tab`, error);
                }
                try {
                    await pageToClose.close();
                } catch (error: any) {
                    LoggerService.logError(`WARNING: An error occurred when closing the tab`, error);
                }
            }
        });
    }

    resolveClick(page: any, cashmail: Mail) {
        LoggerService.log(`Redirected to ${page.url()}`);
        LoggerService.log(`Saving statistic`);

        this.statisticsService.addClick(cashmail.handler.name, cashmail.account);
        this.stateService.text = `Deleting mail from ${cashmail.handler.name}`;
        if (!PlatformUtil.isDevelopment()) {
            LoggerService.log(`Deleting mail from ${cashmail.from}`);
            this.mailClient.deleteMail(cashmail.id);
        }
    }

    private async getBrowserByPlatform(): Promise<any> {
        if (PlatformUtil.isDevelopment()) {
            return await puppeteer.launch({
                headless: true,
                args: this.getBrowserArgs()
            });
        } else {
            return await puppeteerCore.launch({
                headless: true,
                defaultViewport: null,
                executablePath: '/usr/bin/chromium-browser',
                args: this.getBrowserArgs()
        });
        }
    }

    private getBrowserArgs(): any {
        return [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-sandbox",
        ];
    }

    private get browser(): any {
        return this._browser;
    }

    private set browser(browser: any) {
        this._browser = browser;
    }

    private get handlers(): Handler[] {
        return this._handlers;
    }

    private set handlers(handlers: Handler[]) {
        this._handlers = handlers;
    }

    private get mailClient(): GmailClient {
        return this._mailClient;
    }

    private set mailClient(mailClient: GmailClient) {
        this._mailClient = mailClient;
    }

    private get statisticsService(): StatisticsService {
        return this._statisticsService;
    }

    private set statisticsService(statisticsService: StatisticsService) {
        this._statisticsService = statisticsService;
    }

    private get stateService(): StateService {
        return this._stateService;
    }

    private set stateService(stateService: StateService) {
        this._stateService = stateService;
    }

}