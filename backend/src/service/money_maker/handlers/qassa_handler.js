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

    matchUrl(url) {
        return url.includes('/klik/');
    }

    async performCustomAction(_page, _browser) {
        
    }
    
    hasRedirected(page) {
        return super.hasRedirected(page) &&
            (!page.url().includes(this.hostname)) 
            || !page.url().includes('/klik/');
    }

    filter(_mail) {
        return false;
    }

}