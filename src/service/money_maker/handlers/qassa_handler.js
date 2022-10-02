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

    matchFrom(from) {
        return from.includes(`${this.hostname}>`);
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