import Handler from "./handler.js";

export default class ZinnGeldHandler extends Handler {
    
    constructor(name) {
        super(name);
    }

    matchUrl(url) {
        return url.host.includes('zinngeld') && url.path.includes('maillink');
    }

    async performCustomAction(_page, _url, _browser) {
    }
    
    hasRedirected(url) {
        return super.hasRedirected(url) && true;
    }

    filter(_mail) {
        return false;
    }

}