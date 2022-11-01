import Handler from "./handler.js";

export default class QassaHandler extends Handler {

    constructor(name) {
        super(name);
    }

    getName() {
        return this.name;
    }

    matchUrl(url) {
        return url.path.includes('/klik/');
    }

    async performCustomAction(_page, _url, _browser) {
        
    }
    
    hasRedirected(page, url) {
        return super.hasRedirected(page, url) && !url.host.includes('qassa');
    }

    filter(_mail) {
        return false;
    }

}