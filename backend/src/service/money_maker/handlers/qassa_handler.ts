import { Browser, Page } from "../../../../node_modules/puppeteer/lib/types.js";
import Mail from "../../../domain/mail.js";
import Url from "../../../domain/url.js";
import Handler from "./handler.js";

export default class QassaHandler extends Handler {

    public constructor(name: string) {
        super(name);
    }

    public matchUrl(url: Url): boolean {
        return url.path.includes('/klik/');
    }

    public async performCustomAction(_page: Page, _url: Url, _browser: Browser): Promise<void> {
    }
    
    public hasRedirected(url: Url): boolean {
        return super.hasRedirected(url) && !url.host.includes('qassa');
    }

    public filter(_mail: Mail): boolean {
        return false;
    }

    protected getSkipSubjects(): string[] {
        return [];
    }

}