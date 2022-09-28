import Handler from "./handler.js";

export default class GeldraceHandler extends Handler {
    
    constructor(name) {
        super(name);
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

    filter(_mail) {
        return false;
    }

}