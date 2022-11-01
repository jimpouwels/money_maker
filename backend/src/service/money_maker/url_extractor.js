import UrlUtil from "../../util/url_util.js";
import LoggerService from "../logger_service.js";

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
                const url = UrlUtil.parse(match[1]);
                if (handler.matchUrl(url)) {
                    console.log(`Found URL ${url}`);
                    return url;
                }
            }
        }
        LoggerService.log(`No URL found for ${handler.name}`);
    }
}