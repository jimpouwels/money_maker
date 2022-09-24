export default class NuCashMatcher {

    matchFrom(from) {
        return from.includes('<info@nucash.nl>');
    }

    matchUrl(url) {
        return url.includes('nucash') && url.includes('cm-l') && !url.includes('sid=');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return !page.url().includes('nucash.nl');
    }

}