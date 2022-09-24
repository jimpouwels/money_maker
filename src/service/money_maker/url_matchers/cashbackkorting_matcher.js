export default class CashbackKortingMatcher {

    matchFrom(from) {
        return from.includes('<info@cashbackkorting.nl>');
    }

    matchUrl(url) {
        return url.includes('cashbackkorting') && url.includes('cm-l') && !url.includes('sid=');
    }

    canHaveMultipleCashUrls() {
        return false;
    }

    hasDomain(url) {
        return url.includes('cashbackkorting.nl');
    }

    async performCustomAction(_page) {
    }

    hasRedirected(page) {
        return page.url().includes('cashbackkorting.nl');
    }

}