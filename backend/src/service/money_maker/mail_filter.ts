import MailClient from "../../clients/mail_client.js";
import Mail from "../../domain/mail";
import LoggerService from "../logger_service";
import NoCashmailsFoundError from "./error/no_cashmails_found_error";
import Handler from "./handlers/handler";

export default class MailFilter {

    private _handlers: Handler[];
    private _mailClient: MailClient;

    public constructor(handlers: Handler[], mailClient: MailClient) {
        this.handlers = handlers;
        this.mailClient = mailClient;
    }

    public filterCashMails(mails: Mail[]): Mail[] {
        const cashmails = this.getMatchingMails(mails);
        if (cashmails.length === 0) {
            throw new NoCashmailsFoundError('No matching mails found');
        }
        return cashmails;
    }

    private getMatchingMails(mails: Mail[]): Mail[] {
        const matchingMails: Mail[] = [];
        for (const mail of mails) {
            let matchFound = false;
            for (const handler of this.handlers) {
                if (handler.matchMail(mail)) {
                    if (handler.filter(mail)) {
                        break;
                    }
                    matchFound = true;
                    matchingMails.push(mail);
                    mail.handler = handler;
                    LoggerService.log(`Found cashmail from ${mail.from} for account ${mail.account}`);
                    break;
                }
            };
            if (!matchFound) {
                LoggerService.log(`The mail from ${mail.from} and subject "${mail.subject}" is not a cashmail, deleting it`);
                this.mailClient.deleteMail(mail.id);
            }
        }
        return matchingMails;
    }

    private get handlers(): Handler[] {
        return this._handlers;
    }

    private set handlers(handlers: Handler[]) {
        this._handlers = handlers;
    }

    private get mailClient(): MailClient {
        return this._mailClient;
    }

    private set mailClient(handlers: MailClient) {
        this._mailClient = handlers;
    }

}