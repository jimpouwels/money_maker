export default class ZinnGeldMatcher {

    matchFrom(from) {
        return from.includes('<ledenservice@geldrace.nl>');
    }

    matchUrl(url) {
        return url.includes('geldrace') && url.includes("/c") && !url.includes('login');
    }

    canHaveMultipleCashUrls() {
        return false;
    }

}