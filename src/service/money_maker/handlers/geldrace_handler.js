export default class GeldraceHandler {

    getName() {
        return 'geldrace';
    }

    matchFrom(from) {
        return from.includes('<ledenservice@geldrace.nl>');
    }

    matchUrl(url) {
        return url.includes('geldrace') && url.includes("/c") && !url.includes('login');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return !page.url().includes('geldrace.nl');
    }

}