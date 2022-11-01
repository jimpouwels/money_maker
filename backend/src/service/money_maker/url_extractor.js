import Url from "../../domain/url.js";
import LoggerService from "../logger_service.js";
import InvalidUrlError from "./error/invalid_url_error.js";

export default class UrlExtractor {

    extractUrls(cashmails) {
        for (const cashmail of cashmails) {
            LoggerService.log(`Searching for links in ${cashmail.from}`);
            cashmail.cashUrl = this.extractUrlFromHtml(cashmail.body, cashmail.handler);
        }
    }

    extractUrlFromHtml(body, handler) {
        const matches = body.matchAll('<a[^>]+href=\"(.*?)\"[^>]*>');
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
                } catch (error) {
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