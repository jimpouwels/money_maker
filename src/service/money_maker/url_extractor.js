import NoCashUrlsFoundError from "./error/no_cashurls_found_error.js";

export default class UrlExtractor {

    matchers;

    constructor(matchers) {
        this.matchers = matchers;
    }

    extractUrls(cashmails) {
        for (const cashmail of cashmails) {
            console.log(`Searching for links in ${cashmail.from}`);
            const matches = cashmail.body.matchAll('<a[^>]+href=\"(.*?)\"[^>]*>');
            if (matches.length < 1) {
                console.log(`No cashlink found for ${cashmail.from}, did they change the URL format?`);
            } else {
                urlsLoop: for (const match of matches) {
                    const url = match[1];
                    matchersLoop: for (const matcher of this.matchers) {
                        if (matcher.matchUrl(url)) {
                            let cashUrl = { url: url.replaceAll('&amp;', '&'), from: cashmail.from };
                            cashmail.addCashUrl(cashUrl);
                            console.log(`Found URL ${cashUrl.url} for ${cashmail.from}`);
                            if (matcher.canHaveMultipleCashUrls()) {
                                break matchersLoop;
                            } else {
                                break urlsLoop;
                            }
                        }
                    }
                }
            }
        }
    }

}