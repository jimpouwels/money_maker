import Mail from "../../../domain/mail";
import Url from "../../../domain/url";
import Handler from "./handler";

export default class GeldraceHandler extends Handler {
    
    public constructor(name: string) {
        super(name);
    }

    public matchUrl(url: Url): boolean {
        return url.host.includes('geldrace') && url.path.includes("/clickout") && !url.path.includes('login');
    }

    public async performCustomAction(_page: any, _url: Url, _browser: any): Promise<void> {
    }
    
    public hasRedirected(url: Url, attempts: number): boolean {
        return super.hasRedirected(url, attempts) && !url.path.includes('clickout');
    }

    public override matchMail(mail: Mail): boolean {
        return super.matchMail(mail) && !mail.body.includes('qassa');
    }

    protected getSkipSubjects(): string[] {
        return [];
    }
    
    public isNoCashmail(mail: Mail): boolean {
        return false;
    }

}