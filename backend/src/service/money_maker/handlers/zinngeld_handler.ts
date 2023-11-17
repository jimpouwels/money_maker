import Mail from "../../../domain/mail";
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
    
    public hasRedirected(url: Url, attempts: number): boolean {
        if  (attempts >= 10 && url.full.includes('chrome-error://chromewebdata')) {
            return true;
        }
        return super.hasRedirected(url, attempts) && true;
    }

    protected getSkipSubjects(): string[] {
        return this.skipSubjects;
    }
    
    public isNoCashmail(mail: Mail): boolean {
        return false;
    }

}