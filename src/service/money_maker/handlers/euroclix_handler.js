import Handler from "./handler.js";

export default class EuroClixHandler extends Handler {

    constructor(name) {
        super(name);
    }

    matchFrom(from) {
        return from.includes('<noreply@euroclix.nl>') || from.includes('quirinedeloyer_1200@hotmail.com');
    }

    matchUrl(url) {
        return url.includes('euroclix') && url.includes('reference');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return super.hasRedirected(page) && !page.url().includes('euroclix.nl');
    }

    filter(_mail) {
        return false;
    }

}