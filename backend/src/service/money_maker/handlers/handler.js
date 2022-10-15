export default class Handler {

    name;

    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    hasRedirected(page) {
        return !page.url().includes('chrome-error');
    }

    matchMail(mail) {
        return mail.from.toLowerCase().includes(this.name.toLowerCase());
    }

}