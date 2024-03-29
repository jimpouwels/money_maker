import Handler from "../service/money_maker/handlers/handler";
import Url from "./url";

export default class Mail {

    private _id: string;
    private _from: string;
    private _account: string;
    private _body: string;
    private _subject: string;
    private _cashUrl: Url;
    private _handler: Handler;
    private _markForDeletion: boolean;

    constructor(id: string, from: string, account: string, body: string, subject: string) {
        this.id = id;
        this.from = from;
        this.account = account;
        this.body = body;
        this.subject = subject;
    }

    public get id(): string {
        return this._id;
    }

    public set id(id: string) {
        this._id = id;
    }

    public get from(): string {
        return this._from;
    }

    public set from(from: string) {
        this._from = from;
    }

    public get account(): string {
        return this._account;
    }

    public set account(account: string) {
        this._account = account;
    }

    public get body(): string {
        return this._body;
    }

    public set body(body: string) {
        this._body = body;
    }

    public get subject(): string {
        return this._subject;
    }

    public set subject(subject: string) {
        this._subject = subject;
    }

    public get cashUrl(): Url {
        return this._cashUrl;
    }

    public set cashUrl(cashUrl: Url) {
        this._cashUrl = cashUrl;
    }

    public get handler(): Handler {
        return this._handler;
    }

    public set handler(handler: Handler) {
        this._handler = handler;
    }

    public get markForDeletion(): boolean {
        return this._markForDeletion;
    }

    public set markForDeletion(markForDeletion: boolean) {
        this._markForDeletion = markForDeletion;
    }

}