import Url from "../../../domain/url";
import Handler from "./handler";

export default class ZinnGeldHandler extends Handler {
    
    private skipSubjects = ['nieuwe deelname'];

    public constructor(name: string) {
        super(name);
    }

    public matchUrl(url: Url): boolean {
        return url.host.includes('zinngeld') && url.path.includes('maillink');
    }

    public async performCustomAction(_page: any, _url: Url, _browser: any): Promise<void> {
    }
    
    public hasRedirected(url: Url): boolean {
        return super.hasRedirected(url) && true;
    }

    protected getSkipSubjects(): string[] {
        return this.skipSubjects;
    }

}