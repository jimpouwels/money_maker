import Mail from "../../../domain/mail.js";
import Url from "../../../domain/url.js";
import Handler from "./handler.js";

export default class EuroClixHandler extends Handler {

    public constructor(name: string) {
        super(name);
    }

    public matchUrl(url: Url): boolean {
        return url.host.includes('euroclix.nl') && url.path.includes('reference');
    }

    public async performCustomAction(_page: any, _url: Url, _browser: any): Promise<void> {
    }
    
    public hasRedirected(url: Url): boolean {
        return super.hasRedirected(url) && (!url.host.includes('euroclix.nl') || url.path.includes('utm_campaign'));
    }

    protected getSkipSubjects(): string[] {
        return ['Jouw Clix zijn beschikbaar'];
    }

}