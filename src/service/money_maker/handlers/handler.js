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
        const isForwarded = this.forwarders.includes(mail.from);
        if (isForwarded) {
            mail.isForwarded = true;
        }
        return (mail.from.toLowerCase().includes(this.name.toLowerCase()) || isForwarded)
                || mail.body.toLowerCase().includes(this.name.toLowerCase());
    }

}