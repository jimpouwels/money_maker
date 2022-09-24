export default class NuCashMatcher {

    matchFrom(from) {
        return from.includes('<info@nucash.nl>');
    }

    matchUrl(url) {
        return url.includes('nucash') && url.includes('cm-l') && !url.includes('sid=');
    }

    canHaveMultipleCashUrls() {
        return false;
    }

    async performCustomAction(_page) {
    }
    
    hasRedirected(page) {
        return page.url().includes('nucash.nl');
    }

}