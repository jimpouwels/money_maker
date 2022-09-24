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

    async performCustomAction(page) {
        console.log(`Waiting for green 'click' button for 'DirectVerdiend'`);
        await page.waitForSelector('.btn-green')
        console.log('Found green button, extracting URL');
        const targetUrl = await page.$eval('.btn-green', e => e.getAttribute('href'));
        console.log(`Redirecting to ${targetUrl}`);
        await page.goto(targetUrl);
        console.log(`Redirected to ${targetUrl}`);
    }

    hasRedirected(page) {
        return !page.url().includes('directverdiend.nl');
    }

}