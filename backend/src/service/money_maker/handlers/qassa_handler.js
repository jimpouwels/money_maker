import Handler from "./handler.js";

export default class QassaHandler extends Handler {

    hostname;

    constructor(name, hostname, forwarders) {
        super(name, forwarders);
        this.hostname = hostname;
    }

    getName() {
        return this.name;
    }

    matchUrl(url) {
        return url.includes('/klik/');
    }

    async performCustomAction(page, browser) {
        
    }
    
    hasRedirected(page) {
        return super.hasRedirected(page) && (!page.url().includes(this.hostname)) || page.url() === 'https://www.qassa.nl/';
    }

    filter(_mail) {
        return false;
    }

}