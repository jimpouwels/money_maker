export default class Handler {

    name;

    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    hasRedirected(page) {
        return !page.url().includes('chrome-error');
    }

}