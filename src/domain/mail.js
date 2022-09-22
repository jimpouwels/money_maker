export default class Mail {

    id;
    from;
    body;
    cashUrls = [];

    constructor(id, from, body) {
        this.id = id;
        this.from = from;
        this.body = body;
    }

    addCashUrl(cashUrl) {
        this.cashUrls.push(cashUrl);
    }

}