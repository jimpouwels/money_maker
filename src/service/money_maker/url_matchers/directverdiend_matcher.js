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

    hasDomain(url) {
        return url.includes('directverdiend.nl');
    }

    async performCustomAction(page) {
        console.log(`Waiting for green 'click' button for 'DirectVerdiend'`);
        await page.waitForSelector('.btn-green')
        await page.click('.btn-green');
        console.log(`Green button clicked!`);
    }

    hasRedirected(page) {
        return page.url().includes('directverdiend.nl');
    }

}