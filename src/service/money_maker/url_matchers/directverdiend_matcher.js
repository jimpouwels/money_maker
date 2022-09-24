export default class DirectVerdiendMatcher {

    matchFrom(from) {
        return from.includes('<info@directverdiend.nl>');
    }

    matchUrl(url) {
        return url.includes('directverdiend') && url.includes('/newsletter/click/');
    }

    canHaveMultipleCashUrls() {
        return false;
    }

    async performCustomAction(page, browser) {
        console.log(`Waiting for green 'click' button for 'DirectVerdiend'`);
        const pageTarget = page.target();
        await page.waitForSelector('.btn-green')
        await page.click('.btn-green');
        console.log(`Green button clicked!`);
        const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
        const newPage = await newTarget.page();
        console.log(`Navigate original page to the URL in the newly opened tab`);
        await page.goto(newPage.url());
    }

    hasRedirected(page) {
        return !page.url().includes('directverdiend.nl');
    }

}