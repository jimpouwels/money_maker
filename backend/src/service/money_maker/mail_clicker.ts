import * as puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import ClickNavigationTimedOutError from './error/click_navigation_timed_out_error';
import ThreadUtil from '../../util/thread_util';
import LoggerService from '../logger_service';
import PlatformUtil from '../../util/platform_util';
import Url from '../../domain/url';
import Handler from './handlers/handler';
import StatisticsService from '../statistics_service';
import StateService from '../state_service';
import Mail from '../../domain/mail';
import MailClient from '../../clients/mail_client';

export default class MailClicker {

    private _browser: any;
    private _handlers: Handler[];
    private _mailClient: MailClient;
    private _statisticsService: StatisticsService;
    private _stateService: StateService;
    private static CLICK_NAVIGATION_TIMEOUT: number = 30000;

    public constructor(handlers: Handler[], mailClient: MailClient, statisticsService: StatisticsService, stateService: StateService) {
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
            LoggerService.log(`No cash URL's were found for cashmail from ${cashmail.from}, skipping...`);
            if (cashmail.markForDeletion) {
                LoggerService.log('This is known NOT to be a cashmail, DELETING...');
                await this.mailClient.deleteMail(cashmail.id);
            }
            return;
        }
        let page = await this.browser.newPage();
        LoggerService.log(`\nTrying to open the link '${cashmail.cashUrl.full}' from ${cashmail.from}`);
        const handler = cashmail.handler;
        await page.goto(cashmail.cashUrl.full, { timeout: 15000 }).then(async () => {
            this.stateService.text = `Clicking cashmail from ${handler.name}`;
            await handler.performCustomAction(page, cashmail.cashUrl, this.browser);
            await this.checkRedirection(page, cashmail);
        }).catch(async (error: any) => {
            if (error instanceof ClickNavigationTimedOutError) {
                LoggerService.log(`WARNING: Waited ${MailClicker.CLICK_NAVIGATION_TIMEOUT} milliseconds, but the redirect didn't occur`);
                LoggerService.log(`Timed out waiting for redirect to target, preserving email for review`);
            } else {
                LoggerService.logError(`WARNING: There was an unknown error while navigating: ${error}`, error);
                LoggerService.log(`Check if redirection still happened...`);
                await this.checkRedirection(page, cashmail);
            }
        }).finally(async () => {
            LoggerService.log(`Closing all browser pages`);
            let allPages = (await this.browser.pages());
            LoggerService.log(`${allPages.length} pages to close`);
            for (let i = 0; i < allPages.length; i++) {
                let pageToClose = allPages[i];
                LoggerService.log(`Closing page ${page.url()}`);
                // WORKAROUND: Apparently memory is freed up in a faster/better way when navigation
                // to 'about:blank'.
                try {
                    await pageToClose.goto('about:blank')
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

    private async checkRedirection(page: any, cashmail: Mail) {
        LoggerService.log(`Checking for redirection`);
        let startLoop = Date.now();
        let attempts = 0;
        while (!cashmail.handler.hasRedirected(Url.parse(page.url()), attempts)) {
            LoggerService.log(`Waiting for page to redirect to target from ${page.url()}`);
            await(ThreadUtil.sleep(1000));
            if ((Date.now() - startLoop) > MailClicker.CLICK_NAVIGATION_TIMEOUT) {
                throw new ClickNavigationTimedOutError();
            }
            
            let url = Url.parse(page.url());
            if (attempts >= 10 && (url.full.includes('about:blank') || url.full.includes('chrome-error://chromewebdata') || url.host.toLowerCase().includes(cashmail.handler.name.toLocaleLowerCase()))) {
                LoggerService.log("After 10 attempts, the URL is still " + url.full + ", giving up...");
                break;
            }
            attempts++;
        }
        await this.resolveClick(page, cashmail);
    }

    private async resolveClick(page: any, cashmail: Mail): Promise<void> {
        LoggerService.log(`Redirected to ${page.url()}`);
        LoggerService.log(`Saving statistic`);

        this.statisticsService.addClick(cashmail.handler.name, cashmail.account);
        this.stateService.text = `Deleting mail from ${cashmail.handler.name}`;
        LoggerService.log(`Deleting mail from ${cashmail.from}`);
        await this.mailClient.deleteMail(cashmail.id);
    }

    private async getBrowserByPlatform(): Promise<any> {
        if (PlatformUtil.isDevelopment()) {
            LoggerService.log(`Development mode, using puppeteer`);
            return await puppeteer.launch({
                headless: true,
                args: this.getBrowserArgs()
            });
        } else {
            LoggerService.log(`Production mode, using puppeteerCore`);
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

    private get mailClient(): MailClient {
        return this._mailClient;
    }

    private set mailClient(mailClient: MailClient) {
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