import Mail from "../../../domain/mail";
import Url from "../../../domain/url";
import Handler from "./handler";

export default class ShopBuddiesHandler extends Handler {
    
    public constructor(name: string) {
        super(name);
    }

    public matchUrl(url: Url): boolean {
        return (url.hasParam('linkId') && url.getParam('linkId').includes('storeId') && !url.getParam('linkId').includes('vouhcer')) || url.path.includes('visit/');
    }

    public async performCustomAction(_page: any, _url: Url, _browser: any): Promise<void> {
    }
    
    public hasRedirected(url: Url, attempts: number): boolean {
        return super.hasRedirected(url, attempts) && !url.host.includes('shopbuddies.nl');
    }

    protected getSkipSubjects(): string[] {
        return ['ledenactie'];
    }
    
    public isNoCashmail(mail: Mail): boolean {
        return false;
    }

}