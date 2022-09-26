export default class OrangeBuddiesHandler {

    identifier;

    constructor(identifier) {
        this.identifier = identifier;
    }

    matchFrom(from) {
        return from.includes(`<info@${this.identifier}.nl>`);
    }

    matchUrl(url) {
        return url.includes(this.identifier) && url.includes('cm-l') && !url.includes('sid=');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return !page.url().includes(`${this.identifier}.nl`);
    }

}