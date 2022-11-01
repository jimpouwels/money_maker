import { Browser, Page } from "../../../../node_modules/puppeteer/lib/types.js";
import Mail from "../../../domain/mail.js";
import Url from "../../../domain/url.js";
import ThreadUtil from "../../../util/thread_util.js";
import LoggerService from "../../logger_service.js";
import Handler from "./handler.js";

export default class OnlineLeadsHandler extends Handler {

    private hostname: string;
    private hasNewTabBug: boolean;

    constructor(name: string, hostname: string, hasNewTabBug: boolean = false) {
        super(name);
        this.hostname = hostname;
        this.hasNewTabBug = hasNewTabBug;
    }

    public matchUrl(url: Url): boolean {
        return url.path.includes('/click/');
    }

    public async performCustomAction(page: Page, _url: Url, browser: Browser): Promise<void> {
        const prePageCount = (await browser.pages()).length;

        LoggerService.log(`${this.name} opens the newsletter in a webversion, another click is required`);
        let button1Url = await page.evaluate((): string => {
            return document.getElementsByClassName('btn-green')[0].getAttribute('href');
        });
        await page.goto(button1Url);

        LoggerService.log(`${this.name} opens another page with a button to be clicked, finding and clicking it`);
        try {
            await page.waitForSelector('.btn-green', {timeout: 15000});
        } catch (error) {
            LoggerService.logError(`Unable to find .btn-green button to click it`, error);
            throw error;
        }
        await page.click('.btn-green');

        if (this.hasNewTabBug) {
            LoggerService.log(`The new tab will not open for ${this.name}, that's probably some bug, assume it's clicked...`);
            LoggerService.log('Waiting for 5 seconds to be sure the click gets registered');
            ThreadUtil.sleep(5000);
            return;
        }
        const startLoop = Date.now();
        while (((await browser.pages()).length - prePageCount) == 0) {
            if ((Date.now() - startLoop) > 30000) {
                throw new Error(`A new tab was expected to open, but that didn't happen, failed`)
            }
            LoggerService.log(`Waiting for new tab to open, current amount of tabs ${(await browser.pages()).length}`);
            await ThreadUtil.sleep(1000);
        }
        const allPages = await browser.pages();
        LoggerService.log('Capturing the redirect URL from the new tab and redirecting the current page to that URL');
        const targetUrl = allPages[allPages.length - 1].url();
        if (targetUrl.includes('error')) {
            throw new Error(`The new tab navigated to ${targetUrl}, which seems to be an error`);
        } else if (targetUrl.includes(`http://${this.hostname}`)) {
            throw new Error(`The new tab redirected to ${targetUrl} which seems to be the hostname of ${this.name}, that doesn't seem okay...`);
        } else {
            LoggerService.log(`Found new tab with URL ${targetUrl}`);
        }
    }
    
    public hasRedirected(url: Url): boolean {
        // after the final cash url has been clicked, its link opens in a new tab. As a result, the original 
        // tab redirects to 'https://www.${hostname}/gebruiker/. When that happens, we consider the
        // redirect to be successful.
        return super.hasRedirected(url) && url.path.startsWith('/gebruiker');
    }

    public filter(_mail: Mail): boolean {
        return false;
    }

    protected getSkipSubjects(): string[] {
        return [];
    }

}