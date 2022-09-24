export default class EnqueteClubMatcher {

    matchFrom(from) {
        return from.includes('<info@enqueteclub.nl>');
    }

    matchUrl(url) {
        return url.includes('enqueteclub') && url.includes('cm-l') && !url.includes('sid=');
    }

    canHaveMultipleCashUrls() {
        return false;
    }

    hasDomain(url) {
        return url.includes('enqueteclub.nl');
    }

    async performCustomAction(_page) {
    }
    
    hasRedirected(page) {
        return page.url().includes('enqueteclub.nl');
    }

}