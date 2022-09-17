export default class EnqueteClubMatcher {

    matchFrom(from) {
        return from.includes('<info@enqueteclub.nl>');
    }

    matchUrl(url) {
        return url.includes('enqueteclub') && url.includes('cm-l') && !url.includes('sid=');
    }

}