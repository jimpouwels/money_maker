import Mail from "../../domain/mail";
import Url from "../../domain/url";
import LoggerService from "../logger_service";
import InvalidUrlError from "./error/invalid_url_error";
import Handler from "./handlers/handler";

export default class UrlExtractor {

    public extractUrls(cashmails: Mail[]): void {
        for (const cashmail of cashmails) {
            LoggerService.log(`Searching for links in ${cashmail.from}`);
            try {
                cashmail.cashUrl = this.extractUrlFromHtml(cashmail.body, cashmail.handler);
            } catch (error: any) {
                LoggerService.log(`No URL found for ${cashmail.handler.name}`);
            }
        }
    }

    extractUrlFromHtml(body: string, handler: Handler): Url {
        const matches = Array.from(body.matchAll(/<a[^>]+href=\"(.*?)\"[^>]*>/g));
        if (matches.length < 1) {
            LoggerService.log(`No cashlink found, did they change the URL format?`);
        } else {
            for (const match of matches) {
                const foundMatch = match[1];
                try {
                    const foundUrl = Url.parse(foundMatch);
                    if (handler.matchUrl(foundUrl)) {
                        console.log(`Found URL ${foundUrl.full}`);
                        return foundUrl;
                    }
                } catch (error: any) {
                    if (error instanceof InvalidUrlError) {
                        LoggerService.log(`URL ${foundMatch} is not a valid URL, skipping`);
                    } else {
                        LoggerService.logError(`Unable to find URL`, error);
                    }
                }
            }
        }
        throw new Error(`No matching URL found for ${handler.name}`);
    }
}