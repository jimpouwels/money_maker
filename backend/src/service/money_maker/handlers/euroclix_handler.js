import Handler from "./handler.js";

export default class EuroClixHandler extends Handler {

    constructor(name, forwarders) {
        super(name, forwarders);
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