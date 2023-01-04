import Url from "../../../domain/url";
import Handler from "./handler";

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
        return (super.hasRedirected(url) && (!url.host.includes('euroclix.nl') || url.hasParam('utm_campaign'))) || 
               url.path.includes('error');
    }

    protected getSkipSubjects(): string[] {
        return ['Jouw Clix zijn beschikbaar'];
    }

}