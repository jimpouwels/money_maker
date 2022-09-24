export default class EuroClixMatcher {

    matchFrom(from) {
        return from.includes('<noreply@euroclix.nl>');
    }

    matchUrl(url) {
        return url.includes('euroclix') && url.includes('reference');
    }

    canHaveMultipleCashUrls() {
        return true;
    }

    hasDomain(url) {
        return url.includes('euroclix.nl');
    }

    async performCustomAction(_page) {
    }
    
    hasRedirected(page) {
        return page.url().includes('euroclix.nl');
    }

}