export default class GeldraceMatcher {

    matchFrom(from) {
        return from.includes('<ledenservice@geldrace.nl>');
    }

    matchUrl(url) {
        return url.includes('geldrace') && url.includes("/c") && !url.includes('login');
    }

    canHaveMultipleCashUrls() {
        return false;
    }

    async performCustomAction(_page) {
    }
    
    hasRedirected(page) {
        return page.url().includes('geldrace.nl');
    }

}