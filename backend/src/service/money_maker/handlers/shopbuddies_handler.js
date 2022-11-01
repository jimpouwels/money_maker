import Handler from "./handler.js";

export default class ShopBuddiesHandler extends Handler {

    constructor(name) {
        super(name);
    }

    matchUrl(url) {
        return url.host.includes('shopbuddies') && url.path.includes('newsletter_exit');
    }

    async performCustomAction(_page, _url, _browser) {
    }
    
    hasRedirected(page, url) {
        return super.hasRedirected(page, url) && !page.url().includes('shopbuddies.nl');
    }

    filter(_mail) {
        return false;
    }

}