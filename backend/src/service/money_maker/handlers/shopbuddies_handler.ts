import Url from "../../../domain/url";
import Handler from "./handler";

export default class ShopBuddiesHandler extends Handler {
    
    public constructor(name: string) {
        super(name);
    }

    public matchUrl(url: Url): boolean {
        return url.host.includes('shopbuddies') && url.path.includes('newsletter_exit');
    }

    public async performCustomAction(_page: any, _url: Url, _browser: any): Promise<void> {
    }
    
    public hasRedirected(url: Url, attempts: number): boolean {
        return super.hasRedirected(url, attempts) && !url.host.includes('shopbuddies.nl');
    }

    protected getSkipSubjects(): string[] {
        return ['ledenactie'];
    }

}