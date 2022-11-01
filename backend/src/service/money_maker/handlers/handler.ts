import Mail from "../../../domain/mail";

export default abstract class Handler {

    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    public get name(): string {
        return this._name;
    }

    public hasRedirected(url: any): boolean {
        return !url.full.includes('chrome-error');
    }

    public matchMail(mail: Mail): boolean {
        return mail.from.toLowerCase().includes(this.name.toLowerCase());
    }

    protected abstract getSkipSubjects(): string[];

}