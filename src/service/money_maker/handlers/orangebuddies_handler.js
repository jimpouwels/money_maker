import Handler from "./handler.js";

/**
 * NuCash
 * EnqueteClub
 * CashbackKorting
 * LadyCashback
 * IPay
 * GekkenGoud
 */
export default class OrangeBuddiesHandler extends Handler {

    identifier;
    skipSubjects = [
        'Er is een nieuwe cashbackactie beschikbaar',
        'Top deals deze week'
    ]

    constructor(name, identifier) {
        super(name);
        this.identifier = identifier;
    }

    matchFrom(from) {
        return from.includes(`<info@${this.identifier}.nl>`);
    }

    matchUrl(url) {
        return url.includes(this.identifier) && url.includes('cm-l') && !url.includes('sid=');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return super.hasRedirected(page) && !page.url().includes(`${this.identifier}.nl/`);
    }

    filter(mail) {
        for (const skipSubject of this.skipSubjects) {
            if (mail.subject.includes(skipSubject)) {
                return true;
            }
        }
        return false;
    }

}