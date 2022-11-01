import Handler from "./handler.js";

export default class QassaHandler extends Handler {

    constructor(name) {
        super(name);
    }

    matchUrl(url) {
        return url.path.includes('/klik/');
    }

    async performCustomAction(_page, _url, _browser) {
        
    }
    
    hasRedirected(url) {
        return super.hasRedirected(url) && !url.host.includes('qassa');
    }

    filter(_mail) {
        return false;
    }

}