export default class EnqueteClubHandler {

    matchFrom(from) {
        return from.includes('<info@enqueteclub.nl>');
    }

    matchUrl(url) {
        return url.includes('enqueteclub') && url.includes('cm-l') && !url.includes('sid=');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return !page.url().includes('enqueteclub.nl');
    }

}