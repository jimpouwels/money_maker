import Mail from "../../domain/mail";
import Url from "../../domain/url";
import LoggerService from "../logger_service";
import InvalidUrlError from "./error/invalid_url_error";
import Handler from "./handlers/handler";

export default class UrlExtractor {

    public extractUrls(cashmails: Mail[]): void {
        for (const cashmail of cashmails) {
            LoggerService.log(`Searching for links in ${cashmail.from}`);
            cashmail.cashUrl = this.extractUrlFromHtml(cashmail.body, cashmail.handler);
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
                    const url = Url.parse(foundMatch);
                    if (handler.matchUrl(url)) {
                        console.log(`Found URL ${url.full}`);
                        return url;
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
        LoggerService.log(`No URL found for ${handler.name}`);
    }
}