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

    hasDomain(url) {
        return url.includes('nucash.nl');
    }

}