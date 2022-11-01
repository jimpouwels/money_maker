import Handler from "./handler.js";

export default class GeldraceHandler extends Handler {
    
    constructor(name) {
        super(name);
    }

    matchUrl(url) {
        return url.host.includes('geldrace') && url.path.includes("/clickout") && !url.path.includes('login');
    }

    async performCustomAction(_page, _url, _browser) {
    }
    
    hasRedirected(page, url) {
        return super.hasRedirected(page, url) && !url.full.includes('https://www.geldrace.nl');
    }

    filter(_mail) {
        return false;
    }

    matchMail(mail) {
        return super.matchMail(mail) && !mail.body.includes('qassa');
    }

}