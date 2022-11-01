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
    ];

    constructor(name, identifier) {
        super(name);
        this.identifier = identifier;
    }

    matchUrl(url) {
        return url.host.includes(this.identifier) && url.path.includes('cm-l') && !url.hasParam('sid');
    }

    async performCustomAction(_page, _url, _browser) {
    }
    
    hasRedirected(page, url) {
        return super.hasRedirected(page, url) && (!url.path.includes(this.identifier) || (url.path.includes(this.identifier) && url.path.includes('login.php')));
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