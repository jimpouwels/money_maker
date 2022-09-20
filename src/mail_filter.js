import NoCashmailsFoundError from "./error/no_cashmails_found_error.js";

export default class MailFilter {

    matchers;

    constructor(matchers) {
        this.matchers = matchers;
    }

    filterCashMails(mails) {
        const cashmails = this.getMatchingMails(mails);
        if (cashmails.length === 0) {
            throw new NoCashmailsFoundError('No matching mails found');
        }
        return cashmails;
    }

    getMatchingMails(mails) {
        const matchingMails = [];
        for (const mail of mails) {
            matchersLoop: for (const matcher of this.matchers) {
                if (matcher.matchFrom(mail.from)) {
                    matchingMails.push(mail);
                    console.log(`Found cashmail from ${mail.from}`);
                    break matchersLoop;
                }
            };
        }
        return matchingMails;
    }

}