import Handler from "./handler.js";

export default class ShopBuddiesHandler extends Handler {

    constructor(name) {
        super(name);
    }

    matchMail(mail) {
        return (mail.from.includes('<info@shopbuddies.nl>') || mail.from.includes('quirinedeloyer_1200@hotmail.com'))
             && mail.body.toLowerCase().includes('shopbuddies');
    }

    matchUrl(url) {
        return url.includes('shopbuddies') && url.includes('newsletter_exit');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return super.hasRedirected(page) && !page.url().includes('shopbuddies.nl');
    }

    filter(_mail) {
        return false;
    }

}