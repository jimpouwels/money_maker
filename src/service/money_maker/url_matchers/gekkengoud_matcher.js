export default class GekkengoudMatcher {

    matchFrom(from) {
        return from.includes('<info@gekkengoud.nl>');
    }

    matchUrl(url) {
        return url.includes('gekkengoud') && url.includes('cm-l') && !url.includes('sid=');
    }

    canHaveMultipleCashUrls() {
        return false;
    }

    hasDomain(url) {
        return url.includes('gekkengoud.nl');
    }

    async performCustomAction(_page) {
    }
    
    hasRedirected(page) {
        return page.url().includes('gekkengoud.nl');
    }

}