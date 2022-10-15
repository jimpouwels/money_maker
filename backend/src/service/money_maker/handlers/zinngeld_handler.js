import Handler from "./handler.js";

export default class ZinnGeldHandler extends Handler {
    
    constructor(name) {
        super(name);
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