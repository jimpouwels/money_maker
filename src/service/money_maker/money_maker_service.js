import GmailClient from '../../clients/gmail_client.js';
import MailFilter from './mail_filter.js';
import NoCashmailsFoundError from './error/no_cashmails_found_error.js';
import UrlExtractor from './url_extractor.js';
import NoCashUrlsFoundError from './error/no_cashurls_found_error.js';
import MailClicker from './mail_clicker.js';
import NoSuchClientError from './error/no_such_client_error.js';
import EnqueteClubHandler from './handlers/enqueteclub_handler.js';
import ZinnGeldHandler from './handlers/zinngeld_handler.js';
import EuroClixHandler from './handlers/euroclix_handler.js';
import CashbackKortingHandler from './handlers/cashbackkorting_handler.js';
import LadyCashbackHandler from './handlers/ladycashback_handler.js';
import GekkengoudHandler from './handlers/gekkengoud_handler.js';
import IPayHandler from './handlers/ipay_handler.js';
import GeldraceHandler from './handlers/geldrace_handler.js';
import NuCashHandler from './handlers/nucash_handler.js';
import BespaarTotaalHandler from './handlers/bespaartotaal_handler.js';
import ShopBuddiesHandler from './handlers/shopbuddies_handler.js';

export default class MoneyMakerService {

    configs;
    mailFilter;
    urlExtractor;
    mailClicker;
    handlers;

    constructor(configs) {
        this.configs = configs;
        this.handlers = [];
        this.handlers.push(new EnqueteClubHandler());
        this.handlers.push(new ZinnGeldHandler());
        this.handlers.push(new EuroClixHandler());
        this.handlers.push(new CashbackKortingHandler());
        this.handlers.push(new LadyCashbackHandler());
        this.handlers.push(new GekkengoudHandler());
        this.handlers.push(new IPayHandler());
        this.handlers.push(new GeldraceHandler());
        this.handlers.push(new NuCashHandler());
        this.handlers.push(new BespaarTotaalHandler());
        this.handlers.push(new ShopBuddiesHandler());
        this.mailFilter = new MailFilter(this.handlers);
        this.urlExtractor = new UrlExtractor(this.handlers);
    }

    async makeMoney() {
        for (const config of this.configs) {
            try {
                const client = this.getClient(config);
                let mailClicker = new MailClicker(this.handlers, client);
        
                console.log(`\n---SEARCHING CASH MAILS FOR ${config.userId}---`);
                const allMails = await client.getCashMails(config.labelId)
                const cashmails = this.mailFilter.filterCashMails(allMails);
        
                console.log('\n---SCANNING CASH MAILS FOR URLS---');
                this.urlExtractor.extractUrls(cashmails);
                
                console.log('\n---CLICKING CASH LINKS, MAKING MONEY!---');
                await mailClicker.openBrowser();
                for (const cashmail of cashmails) {
                    await mailClicker.click(cashmail);
                };
                await mailClicker.closeBrowser();
        
                console.log('\nAll cash URL\'s were clicked!');
            } catch (error) {
                if (error instanceof NoCashUrlsFoundError) {
                    console.log('ERROR: There were cashmails, but no cash URL\'s were found');
                } else if (error instanceof NoCashmailsFoundError) {
                    console.log('No cashmails found at this time, done!');
                } else if (error instanceof NoSuchClientError) {
                    console.log(`ERROR: Unknown mail type ${config.type}, skipping clicks for ${config.userId}`);
                    return;
                } else {
                    console.log(`ERROR: There was an unexpected error when making money:`, error);
                }
            }
        }
    }
    
    getClient(config) {
        if (config.type === 'gmail') {
            return new GmailClient(config.userId, 
                                    config.clientId, 
                                    config.clientSecret, 
                                    config.refreshToken, 
                                    config.redirectUri);
        }
        throw new NoSuchClientError();
    }
    
    async deleteMails(client, cashmails) {
        for (const cashmail of cashmails) {
            if (!cashmail.linksFound) {
                console.log(`No links were found for ${cashmail.from}, keeping the mail for review...`)
                continue;
            }
            await client.deleteMail(cashmail.id);
            console.log(`Mail from ${cashmail.from} deleted`);
        }
    }

}