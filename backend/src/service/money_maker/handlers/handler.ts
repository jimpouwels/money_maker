import Mail from "../../../domain/mail";

export default class Handler {

    name: string;

    constructor(name: string) {
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    hasRedirected(url: any): boolean {
        return !url.full.includes('chrome-error');
    }

    matchMail(mail: Mail): void {
        return mail.from.toLowerCase().includes(this.name.toLowerCase());
    }

}