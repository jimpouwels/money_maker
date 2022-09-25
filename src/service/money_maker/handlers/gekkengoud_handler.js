export default class GekkengoudHandler {

    matchFrom(from) {
        return from.includes('<info@gekkengoud.nl>');
    }

    matchUrl(url) {
        return url.includes('gekkengoud') && url.includes('cm-l') && !url.includes('sid=');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return !page.url().includes('gekkengoud.nl');
    }

}