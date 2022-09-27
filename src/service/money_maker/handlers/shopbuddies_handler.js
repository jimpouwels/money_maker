export default class ShopBuddiesHandler {

    getName() {
        return 'shopbuddies';
    }

    matchFrom(from) {
        return from.includes('<info@shopbuddies.nl>');
    }

    matchUrl(url) {
        return url.includes('shopbuddies') && url.includes('newsletter_exit');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(page) {
        return !page.url().includes('shopbuddies.nl');
    }

}