import Url from "../../../domain/url.js";
import Handler from "./handler.js";

export default class ShopBuddiesHandler extends Handler {
    
    public constructor(name: string) {
        super(name);
    }

    public matchUrl(url: Url): boolean {
        return url.host.includes('shopbuddies') && url.path.includes('newsletter_exit');
    }

    public async performCustomAction(_page: any, _url: Url, _browser: any): Promise<void> {
    }
    
    public hasRedirected(url: Url): boolean {
        return super.hasRedirected(url) && !url.host.includes('shopbuddies.nl');
    }

    protected getSkipSubjects(): string[] {
        return ['ledenactie'];
    }

}