import Handler from "./handler.js";

export default class EuroClixHandler extends Handler {

    constructor(name) {
        super(name);
    }

    matchMail(mail) {
        return (mail.from.includes('<noreply@euroclix.nl>') || mail.from.includes('quirinedeloyer_1200@hotmail.com'))
             && mail.body.toLowerCase().includes('euroclix');
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