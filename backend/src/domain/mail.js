export default class Mail {

    id;
    from;
    account;
    body;
    subject;
    cashUrl;

    constructor(id, from, account, body, subject) {
        this.id = id;
        this.from = from;
        this.account = account;
        this.body = body;
        this.subject = subject;
    }

}