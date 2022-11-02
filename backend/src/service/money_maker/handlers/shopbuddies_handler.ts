import { Browser, Page } from "../../../../node_modules/puppeteer/lib/types.js";
import Mail from "../../../domain/mail.js";
import Url from "../../../domain/url.js";
import Handler from "./handler.js";

export default class ShopBuddiesHandler extends Handler {
    
    public constructor(name: string) {
        super(name);
    }

    public matchUrl(url: Url): boolean {
        return url.host.includes('shopbuddies') && url.path.includes('newsletter_exit');
    }

    public async performCustomAction(_page: Page, _url: Url, _browser: Browser): Promise<void> {
    }
    
    public hasRedirected(url: Url): boolean {
        return super.hasRedirected(url) && !url.host.includes('shopbuddies.nl');
    }

    public filter(mail: Mail): boolean {
        return this.getSkipSubjects().find(subject => mail.subject.toLowerCase().includes(subject)) != null;
    }

    protected getSkipSubjects(): string[] {
        return ['ledenactie'];
    }

}