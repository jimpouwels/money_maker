import path from 'path';

export default class BespaarTotaalHandler {

    matchFrom(from) {
        return from.includes('<info@bespaarportaal.nl>');
    }

    matchUrl(url) {
        return url.includes('/click/');
    }

    async performCustomAction(page, browser) {
        const prePageCount = (await browser.pages()).length;

        console.log(`BespaarTotaal opens the newsletter in a webversion, another click is required`);
        let button1Url = await page.evaluate(() => {
            return document.getElementsByClassName('btn-green')[0].href;
        });
        await page.goto(button1Url);

        console.log(`BespaarTotaal opens another page with a button to be clicked, finding and clicking it`);
        await page.waitForSelector('.btn-green')
        await page.click('.btn-green');

        while ((((await browser.pages()).length) - prePageCount) == 0) {
            console.log('Waiting for new tab to open');
            await this.sleep(1000);
        }
        const allPages = await browser.pages();
        console.log('Capturing the redirect URL from the new tab and redirecting the current page to that URL');
        const targetUrl = allPages[allPages.length - 1].url();
        await page.goto(targetUrl);
    }
    
    hasRedirected(page) {
        return !page.url().includes('bespaarportaal.nl');
    }

    async sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

}