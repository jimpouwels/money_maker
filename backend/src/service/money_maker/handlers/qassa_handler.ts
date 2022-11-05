import Url from "../../../domain/url";
import Handler from "./handler";

export default class QassaHandler extends Handler {

    public constructor(name: string) {
        super(name);
    }

    public matchUrl(url: Url): boolean {
        return url.path.includes('/klik/');
    }

    public async performCustomAction(_page: any, _url: Url, _browser: any): Promise<void> {
    }
    
    public hasRedirected(url: Url): boolean {
        return super.hasRedirected(url) && !url.path.includes('/klik/');
    }

    protected getSkipSubjects(): string[] {
        return [];
    }

}