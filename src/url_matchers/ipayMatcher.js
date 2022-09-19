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

}