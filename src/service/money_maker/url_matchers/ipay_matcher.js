export default class IPayMatcher {

    matchFrom(from) {
        return from.includes('<info@ipay.nl>');
    }

    matchUrl(url) {
        return url.includes('ipay') && url.includes('cm-l') && !url.includes('sid=');
    }

    canHaveMultipleCashUrls() {
        return false;
    }

    async performCustomAction(_page) {
    }
    
    hasRedirected(page) {
        return page.url().includes('ipay.nl');
    }
}