import Handler from "./handler.js";

export default class GeldraceHandler extends Handler {
    
    constructor(name, forwarders) {
        super(name, forwarders);
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