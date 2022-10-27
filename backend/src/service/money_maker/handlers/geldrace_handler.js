import Handler from "./handler.js";

export default class GeldraceHandler extends Handler {
    
    constructor(name) {
        super(name);
    }

    matchUrl(url) {
        return url.includes('geldrace') && url.includes("/clickout") && !url.includes('login');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return super.hasRedirected(page) && !page.url().includes('https://www.geldrace.nl');
    }

    filter(_mail) {
        return false;
    }

    matchMail(mail) {
        return super.matchMail(mail) && !mail.body.includes('qassa');
    }

}