export default class EuroClixMatcher {

    matchFrom(from) {
        return from.includes('<noreply@euroclix.nl>');
    }

    matchUrl(url) {
        return url.includes('euroclix') && url.includes('reference');
    }

}