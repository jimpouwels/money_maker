import { Browser, Page } from "../../../../node_modules/puppeteer/lib/types.js";
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

    public async performCustomAction(_page: Page, _url: Url, _browser: Browser): Promise<void> {
    }
    
    public hasRedirected(url: Url): boolean {
        return super.hasRedirected(url) && url.host.includes('geldrace.nl');
    }

    public filter(_mail: Mail): boolean {
        return false;
    }

    public override matchMail(mail: Mail): boolean {
        return super.matchMail(mail) && !mail.body.includes('qassa');
    }

    protected getSkipSubjects(): string[] {
        return [];
    }

}