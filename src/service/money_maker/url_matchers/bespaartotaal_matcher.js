import path from 'path';

export default class BespaarTotaalMatcher {

    matchFrom(from) {
        return from.includes('<info@bespaarportaal.nl>');
    }

    matchUrl(url) {
        return url.includes('/newsletter/click/');
    }

    async performCustomAction(page, browser) {
        const pageTarget = page.target();
        
        await page.screenshot({
            path: path.join(process.cwd(), "screenshot1.png"),
            fullPage: true
        });
        await page.waitForSelector('.btn-green');
        await page.click('.btn-green');
        await page.screenshot({
            path: path.join(process.cwd(), "screenshot2.png"),
            fullPage: true
        });

        const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
        const newPage = await newTarget.page();
        await page.goto(newPage.url());
        await newPage.close();
        await page.screenshot({
            path: path.join(process.cwd(), "screenshot3.png"),
            fullPage: true
        });
    }
    
    hasRedirected(page) {
        return !page.url().includes('bespaarportaal.nl');
    }

}