import Mail from "../../../domain/mail";

export default class Handler {

    name: string;

    constructor(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    hasRedirected(url: any) {
        return !url.full.includes('chrome-error');
    }

    matchMail(mail: Mail) {
        return mail.from.toLowerCase().includes(this.name.toLowerCase());
    }

}