import Handler from "./handler.js";

export default class GeldraceHandler extends Handler {
    
    constructor(name) {
        super(name);
    }

    matchFrom(from) {
        return from.includes('<ledenservice@geldrace.nl>') ||
               (from.includes('<ledenservice@geldrace.nl>') && from.includes('quirinedeloyer_1200@hotmail.com'));
    }

    matchUrl(url) {
        return url.includes('geldrace') && url.includes("/c") && !url.includes('login');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return super.hasRedirected(page) && !page.url().includes('https://www.geldrace.nl');
    }

    filter(_mail) {
        return false;
    }

}