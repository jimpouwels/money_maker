export default class UrlExtractor {

    extractUrls(cashmails) {
        for (const cashmail of cashmails) {
            console.log(`Searching for links in ${cashmail.from}`);
            cashmail.cashUrl = this.extractUrlFromHtml(cashmail.body, cashmail.handler);
        }
    }

    extractUrlFromHtml(body, handler) {
        const matches = body.matchAll('<a[^>]+href=\"(.*?)\"[^>]*>');
        if (matches.length < 1) {
            console.log(`No cashlink found, did they change the URL format?`);
        } else {
            for (const match of matches) {
                const url = match[1];
                if (handler.matchUrl(url)) {
                    let cashUrl = url.replaceAll('&amp;', '&');
                    console.log(`Found URL ${cashUrl}`);
                    return cashUrl;
                }
            }
        }
        console.log(`No URL found in mail from ${cashmail.from}`);
    }
}