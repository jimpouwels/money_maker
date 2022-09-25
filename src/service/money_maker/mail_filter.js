import NoCashmailsFoundError from "./error/no_cashmails_found_error.js";

export default class MailFilter {

    handlers;

    constructor(handlers) {
        this.handlers = handlers;
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
            matchersLoop: for (const handler of this.handlers) {
                if (handler.matchFrom(mail.from)) {
                    matchingMails.push(mail);
                    mail.handler = handler;
                    console.log(`Found cashmail from ${mail.from}`);
                    break matchersLoop;
                }
            };
        }
        return matchingMails;
    }

}