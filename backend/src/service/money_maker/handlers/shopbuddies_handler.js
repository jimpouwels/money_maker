import Handler from "./handler.js";

export default class ShopBuddiesHandler extends Handler {
    
    skipSubjects = [
        'ledenactie'
    ];

    constructor(name) {
        super(name);
    }

    matchUrl(url) {
        return url.host.includes('shopbuddies') && url.path.includes('newsletter_exit');
    }

    async performCustomAction(_page, _url, _browser) {
    }
    
    hasRedirected(url) {
        return super.hasRedirected(url) && !url.host.includes('shopbuddies.nl');
    }

    filter(mail) {
        return this.skipSubjects.find(subject => mail.subject.toLowerCase().includes(subject)) != null;
    }

}