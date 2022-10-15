import Handler from "./handler.js";

export default class EuroClixHandler extends Handler {

    constructor(name) {
        super(name);
    }

    matchUrl(url) {
        return url.includes('euroclix') && url.includes('reference');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return super.hasRedirected(page) && (!page.url().includes('euroclix.nl') || page.url().includes('utm_campaign'));
    }

    filter(_mail) {
        return false;
    }

}