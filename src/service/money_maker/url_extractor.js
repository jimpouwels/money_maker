export default class UrlExtractor {

    extractUrls(cashmails) {
        for (const cashmail of cashmails) {
            console.log(`Searching for links in ${cashmail.from}`);
            cashmail.cashUrls = this.extractUrlsFromHtml(cashmail.body, cashmail.handler);
        }
    }

    extractUrlsFromHtml(body, handler) {
        const foundUrls = [];
        const matches = body.matchAll('<a[^>]+href=\"(.*?)\"[^>]*>');
        if (matches.length < 1) {
            console.log(`No cashlink found, did they change the URL format?`);
        } else {
            for (const match of matches) {
                const url = match[1];
                if (handler.matchUrl(url)) {
                    let cashUrl = url.replaceAll('&amp;', '&');
                    console.log(`Found URL ${cashUrl}`);
                    foundUrls.push(cashUrl);
                    break;
                }
            }
        }
        return foundUrls;
    }
}