export default class ZinnGeldMatcher {

    matchFrom(from) {
        return from.includes('<info@zinngeld.nl>');
    }

    matchUrl(url) {
        return url.includes('zinngeld') && url.includes('maillink');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return !page.url().includes('https://www.zinngeld.nl');
    }

}