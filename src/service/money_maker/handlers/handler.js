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
        return (mail.from.toLowerCase().includes(this.name.toLowerCase()) || this.forwarders.includes(mail.from))
                || mail.body.toLowerCase().includes(this.name.toLowerCase());
    }

}