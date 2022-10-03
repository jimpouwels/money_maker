import Handler from "./handler.js";

export default class ZinnGeldHandler extends Handler {
    
    constructor(name) {
        super(name);
    }

    matchMail(mail) {
        return (mail.from.includes('<info@zinngeld.nl>') || mail.from.includes('quirinedeloyer_1200@hotmail.com'))
               && mail.body.toLowerCase().includes('zinngeld');
    }

    matchUrl(url) {
        return url.includes('zinngeld') && url.includes('maillink');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return super.hasRedirected(page) && true;
    }

    filter(_mail) {
        return false;
    }

}