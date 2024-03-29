import Mail from "../../../domain/mail";
import Url from "../../../domain/url";
import Handler from "./handler";

export default class QassaHandler extends Handler {

    public constructor(name: string) {
        super(name);
    }

    public matchUrl(url: Url): boolean {
        return url.path.includes('/mailing/');
    }

    public async performCustomAction(_page: any, _url: Url, _browser: any): Promise<void> {
    }
    
    public hasRedirected(url: Url, attempts: number): boolean {
        return super.hasRedirected(url, attempts) && !url.path.includes('/klik/');
    }

    protected getSkipSubjects(): string[] {
        return [];
    }
    
    public isNoCashmail(mail: Mail): boolean {
        return mail.body.toLowerCase().includes('je ontvangt geen qoins');
    }

}