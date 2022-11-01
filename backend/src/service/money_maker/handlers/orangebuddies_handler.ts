import { Browser, Page } from "../../../../node_modules/puppeteer/lib/types.js";
import Mail from "../../../domain/mail.js";
import Url from "../../../domain/url.js";
import Handler from "./handler.js";

export default class OrangeBuddiesHandler extends Handler {

    private _identifier: string;

    constructor(name: string, identifier: string) {
        super(name);
        this.identifier = identifier;
    }

    public get identifier(): string {
        return this._identifier;
    }

    public set identifier(value: string) {
        this._identifier = value;
    }

    public matchUrl(url: Url): boolean {
        return url.host.includes(this.identifier) && url.path.includes('cm-l') && !url.hasParam('sid');
    }

    public async performCustomAction(_page: Page, _url: Url, _browser: Browser): Promise<void> {
    }
    
    public hasRedirected(url: Url): boolean {
        return super.hasRedirected(url) && 
            (!url.host.includes(this.identifier) || 
            (url.host.includes(this.identifier) && url.path.includes('login.php')));
    }

    public filter(mail: Mail): boolean {
        return this.getSkipSubjects().find(subject => mail.subject.toLowerCase().includes(subject)) != null;
    }

    protected getSkipSubjects(): string[] {
        return [
            'er is een nieuwe cashbackactie beschikbaar',
            'top deals deze week'
        ];
    }

}