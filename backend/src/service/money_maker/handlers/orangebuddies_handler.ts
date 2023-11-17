import Mail from "../../../domain/mail";
import Url from "../../../domain/url";
import LoggerService from "../../logger_service";
import Handler from "./handler";

export default class OrangeBuddiesHandler extends Handler {

    private _identifier: string;

    public constructor(name: string, identifier: string) {
        super(name);
        this.identifier = identifier;
    }

    public get identifier(): string {
        return this._identifier;
    }

    public set identifier(value: string) {
        this._identifier = value;
    }

    public matchUrl(url: Url): boolean {
        return url.host.includes(this.identifier) && url.hasParam('linkId') && !url.getParam('linkId').includes('bannerId');
    }

    public async performCustomAction(_page: any, _url: Url, _browser: any): Promise<void> {
    }
    
    public hasRedirected(url: Url, attempts: number): boolean {
        if (attempts >= 10 && url.host.includes(this.identifier)) {
            LoggerService.log("After 10 attempts the page is still at the domain of the sender of the mail, marking as clicked...")
            return true;
        }
        return super.hasRedirected(url, attempts) && 
            (!url.host.includes(this.identifier) || 
            (url.host.includes(this.identifier) && url.path.includes('login'))) ||
            url.path.includes('404.php');
    }
    
    public isNoCashmail(mail: Mail): boolean {
        return mail.body.toLocaleLowerCase().includes('de beste deals van vandaag');
    }

    protected getSkipSubjects(): string[] {
        return [
            'er is een nieuwe cashbackactie beschikbaar',
            'top deals deze week'
        ];
    }

}