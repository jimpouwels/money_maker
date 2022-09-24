export default class ZinnGeldMatcher {

    matchFrom(from) {
        return from.includes('<info@zinngeld.nl>');
    }

    matchUrl(url) {
        return url.includes('zinngeld') && url.includes('maillink');
    }

    canHaveMultipleCashUrls() {
        return false;
    }

    async performCustomAction(_page) {
    }
    
    hasRedirected(page) {
        return page.url().includes('zinngeld.nl');
    }

}