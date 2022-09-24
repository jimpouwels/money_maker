export default class LadyCashbackMatcher {

    matchFrom(from) {
        return from.includes('<info@ladycashback.nl>');
    }

    matchUrl(url) {
        return url.includes('ladycashback') && url.includes('cm-l') && !url.includes('sid=');
    }

    canHaveMultipleCashUrls() {
        return false;
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return !page.url().includes('ladycashback.nl');
    }

}