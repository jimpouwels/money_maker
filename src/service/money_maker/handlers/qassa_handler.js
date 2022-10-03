import Handler from "./handler.js";

export default class QassaHandler extends Handler {

    hostname;

    constructor(name, hostname) {
        super(name);
        this.hostname = hostname;
    }

    getName() {
        return this.name;
    }

    matchMail(mail) {
        return (mail.from.includes(`${this.hostname}>`) || mail.from.includes('quirinedeloyer_1200@hotmail.com'))
            && mail.body.toLowerCase().includes(this.hostname);
    }

    matchUrl(url) {
        return url.includes('/klik/');
    }

    async performCustomAction(page, browser) {
        
    }
    
    hasRedirected(page) {
        return super.hasRedirected(page) && !page.url().includes(this.hostname);
    }

    filter(_mail) {
        return false;
    }

}