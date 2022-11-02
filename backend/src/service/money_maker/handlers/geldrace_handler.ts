import Mail from "../../../domain/mail.js";
import Url from "../../../domain/url.js";
import Handler from "./handler.js";

export default class GeldraceHandler extends Handler {
    
    public constructor(name: string) {
        super(name);
    }

    public matchUrl(url: Url): boolean {
        return url.host.includes('geldrace') && url.path.includes("/clickout") && !url.path.includes('login');
    }

    public async performCustomAction(_page: any, _url: Url, _browser: any): Promise<void> {
    }
    
    public hasRedirected(url: Url): boolean {
        return super.hasRedirected(url) && !url.host.includes('geldrace.nl');
    }

    public override matchMail(mail: Mail): boolean {
        return super.matchMail(mail) && !mail.body.includes('qassa');
    }

    protected getSkipSubjects(): string[] {
        return [];
    }

}