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
        const linkElement = await page.$('a[href]');
        const hrefAttributeValue = await page.evaluate(
            link => link.getAttribute('href'),
            linkElement,
        );
        console.log(`Redirecting to ${hrefAttributeValue}`);
        await page.goto(hrefAttributeValue);
        console.log(`Redirected to ${hrefAttributeValue}`);
    }

    hasRedirected(page) {
        return !page.url().includes('directverdiend.nl');
    }

}