export default class Mail {

    id;
    from;
    body;
    subject;
    cashUrls = [];

    constructor(id, from, body) {
        this.id = id;
        this.from = from;
        this.body = body;
    }

}