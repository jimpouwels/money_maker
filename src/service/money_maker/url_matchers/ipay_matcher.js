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

    hasDomain(url) {
        return url.includes('ipay.nl');
    }

    async performCustomAction(_page) {
    }
    
    hasRedirected(page) {
        return page.url().includes('ipay.nl');
    }
}