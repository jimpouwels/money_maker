export default class ZinnGeldHandler {
    
    getName() {
        return 'zinngeld';
    }

    matchFrom(from) {
        return from.includes('<info@zinngeld.nl>');
    }

    matchUrl(url) {
        return url.includes('zinngeld') && url.includes('maillink');
    }

    async performCustomAction(_page, _browser) {
    }
    
    hasRedirected(_page) {
        return true;
    }

}