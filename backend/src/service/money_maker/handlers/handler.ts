import Mail from "../../../domain/mail";
import Url from "../../../domain/url";

export default abstract class Handler {

    private _name: string;

    public constructor(name: string) {
        this.name = name;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public hasRedirected(url: Url | null): boolean {
        if (!url) {
            return false;
        }
        return !url.full.includes('chrome-error') && !url.full.includes('about:blank');
    }   

    public matchMail(mail: Mail): boolean {
        return mail.from.toLowerCase().includes(this.name.toLowerCase());
    }

    public filter(mail: Mail): boolean {
        return this.getSkipSubjects().find(subject => mail.subject.toLowerCase().includes(subject.toLowerCase())) != null;
    }

    public abstract matchUrl(url: Url): boolean;

    public abstract performCustomAction(page: any, _url: Url, browser: any): Promise<void>;

    protected abstract getSkipSubjects(): string[];

}