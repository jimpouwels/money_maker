export default class IPayHandler {

    matchFrom(from) {
        return from.includes('<info@ipay.nl>');
    }

    matchUrl(url) {
        return url.includes('ipay') && url.includes('cm-l') && !url.includes('sid=');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return !page.url().includes('ipay.nl');
    }
}