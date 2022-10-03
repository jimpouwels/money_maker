import Handler from "./handler.js";

export default class GeldraceHandler extends Handler {
    
    constructor(name) {
        super(name);
    }

    matchMail(mail) {
        return (mail.from.includes('<ledenservice@geldrace.nl>') || mail.from.includes('quirinedeloyer_1200@hotmail.com'))
            && mail.body.toLowerCase().includes('geldrace');
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