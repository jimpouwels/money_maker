import ThreadUtil from "../../../util/thread_util.js";
import LoggerService from "../../logger_service.js";
import Handler from "./handler.js";

export default class OnlineLeadsHandler extends Handler {

    hostname;
    hasNewTabBug;

    constructor(name, hostname, hasNewTabBug = false) {
        super(name);
        this.hostname = hostname;
        this.hasNewTabBug = hasNewTabBug;
    }

    getName() {
        return this.name;
    }

    matchUrl(url) {
        return url.path.includes('/click/');
    }

    async performCustomAction(page, _url, browser) {
        const prePageCount = (await browser.pages()).length;

        LoggerService.log(`${this.getName()} opens the newsletter in a webversion, another click is required`);
        let button1Url = await page.evaluate(() => {
            return document.getElementsByClassName('btn-green')[0].href;
        });
        await page.goto(button1Url);

        LoggerService.log(`${this.getName()} opens another page with a button to be clicked, finding and clicking it`);
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
    
    hasRedirected(url) {
        // after the final cash url has been clicked, its link opens in a new tab. As a result, the original 
        // tab redirects to 'https://www.${hostname}/gebruiker/. When that happens, we consider the
        // redirect to be successful.
        return super.hasRedirected(url) && url.path.startsWidth('/gebruiker');
    }

    filter(_mail) {
        return false;
    }

}