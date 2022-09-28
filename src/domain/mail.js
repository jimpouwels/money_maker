export default class Mail {

    id;
    from;
    body;
    subject;
    cashUrl;

    constructor(id, from, body, subject) {
        this.id = id;
        this.from = from;
        this.body = body;
        this.subject = subject;
    }

}