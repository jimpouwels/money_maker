export default class CashbackKortingMatcher {

    matchFrom(from) {
        return from.includes('<info@cashbackkorting.nl>');
    }

    matchUrl(url) {
        return url.includes('cashbackkorting') && url.includes('cm-l') && !url.includes('sid=');
    }

    async performCustomAction(_page, _browser) {
    }

    hasRedirected(page) {
        return !page.url().includes('cashbackkorting.nl');
    }

}