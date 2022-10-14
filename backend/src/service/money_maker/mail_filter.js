import PlatformUtil from "../../util/platform_util.js";
import LoggerService from "../logger_service.js";
import NoCashmailsFoundError from "./error/no_cashmails_found_error.js";

export default class MailFilter {

    handlers;
    mailClient;

    constructor(handlers, mailClient) {
        this.handlers = handlers;
        this.mailClient = mailClient;
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
            let matchFound = false;
            handlersLoop: for (const handler of this.handlers) {
                if (handler.matchMail(mail)) {
                    if (handler.filter(mail)) {
                        break handlersLoop;
                    }
                    matchFound = true;
                    matchingMails.push(mail);
                    mail.handler = handler;
                    LoggerService.log(`Found cashmail from ${mail.from}`);
                    break handlersLoop;
                }
            };
            if (!matchFound) {
                if (!PlatformUtil.isDevelopment()) {
                    LoggerService.log(`The mail from ${mail.from} and subject "${mail.subject}" is not a cashmail, deleting it`);
                    this.mailClient.deleteMail(mail.id);
                }
                LoggerService.log(`Mail deleted`);
            }
        }
        return matchingMails;
    }

}