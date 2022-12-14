import Url from "../../../domain/url";
import Handler from "./handler";

export default class OrangeBuddiesHandler extends Handler {

    private _identifier: string;

    public constructor(name: string, identifier: string) {
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

    public async performCustomAction(_page: any, _url: Url, _browser: any): Promise<void> {
    }
    
    public hasRedirected(url: Url): boolean {
        return super.hasRedirected(url) && 
            (!url.host.includes(this.identifier) || 
            (url.host.includes(this.identifier) && url.path.includes('login.php'))) ||
            url.path.includes('404.php');
    }

    protected getSkipSubjects(): string[] {
        return [
            'er is een nieuwe cashbackactie beschikbaar',
            'top deals deze week'
        ];
    }

}