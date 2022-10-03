export default class Handler {

    name;
    forwarders;

    constructor(name, forwarders) {
        this.name = name;
        this.forwarders = forwarders;
    }

    getName() {
        return this.name;
    }

    hasRedirected(page) {
        return !page.url().includes('chrome-error');
    }

    matchMail(mail) {
        for (const forwarder of this.forwarders) {
            if (mail.from.includes(forwarder)) {
                mail.isForwarded = true;
            }
        }
        return mail.body.toLowerCase().includes(this.name.toLowerCase());
    }

}