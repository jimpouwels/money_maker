import GmailClient from '../../clients/gmail_client.js';
import MailFilter from './mail_filter.js';
import NoCashmailsFoundError from './error/no_cashmails_found_error.js';
import UrlExtractor from './url_extractor.js';
import NoCashUrlsFoundError from './error/no_cashurls_found_error.js';
import MailClicker from './mail_clicker.js';
import NoSuchClientError from './error/no_such_client_error.js';
import ZinnGeldHandler from './handlers/zinngeld_handler.js';
import EuroClixHandler from './handlers/euroclix_handler.js';
import GeldraceHandler from './handlers/geldrace_handler.js';
import OnlineLeadsHandler from './handlers/onlineleads_handler.js';
import ShopBuddiesHandler from './handlers/shopbuddies_handler.js';
import OrangeBuddiesHandler from './handlers/orangebuddies_handler.js';
import QassaHandler from './handlers/qassa_handler.js';

export default class MoneyMakerService {

    configs;
    urlExtractor;
    mailClicker;
    handlers;
    statisticsService;
    running = false;

    constructor(configs, statisticsService, forwarders) {
        this.configs = configs;
        this.statisticsService = statisticsService;
        this.handlers = [];
        this.handlers.push(new ZinnGeldHandler('ZinnGeld', forwarders));
        this.handlers.push(new EuroClixHandler('EuroClix', forwarders));
        this.handlers.push(new OrangeBuddiesHandler('EnqueteClub', 'enqueteclub', forwarders));
        this.handlers.push(new OrangeBuddiesHandler('CashbackKorting', 'cashbackkorting', forwarders));
        this.handlers.push(new OrangeBuddiesHandler('LadyCashback', 'ladycashback', forwarders));
        this.handlers.push(new OrangeBuddiesHandler('GekkenGoud', 'gekkengoud', forwarders));
        this.handlers.push(new OrangeBuddiesHandler('IPay', 'ipay', forwarders));
        this.handlers.push(new OrangeBuddiesHandler('NuCash', 'nucash', forwarders));
        this.handlers.push(new GeldraceHandler('GeldRace', forwarders));
        this.handlers.push(new OnlineLeadsHandler('BespaarPortaal', 'bespaarportaal.nl', forwarders));
        this.handlers.push(new OnlineLeadsHandler('DirectVerdiend', 'directverdiend.nl', forwarders));
        this.handlers.push(new OnlineLeadsHandler('DoublePoints', 'doublepoints.nl', forwarders, true));
        this.handlers.push(new ShopBuddiesHandler('ShopBuddies', forwarders));
        this.handlers.push(new QassaHandler('Qassa', 'qassa.nl', forwarders));
        this.urlExtractor = new UrlExtractor(this.handlers);
    }

    async makeMoney() {
        running = true;
        for (const config of this.configs) {
            try {
                const client = this.getClient(config);
                let mailFilter = new MailFilter(this.handlers, client);
                let mailClicker = new MailClicker(this.handlers, client, this.statisticsService);
        
                console.log(`\n---SEARCHING CASH MAILS FOR ${config.userId}---`);
                const allMails = await client.getCashMails(config.labelId)
                const cashmails = mailFilter.filterCashMails(allMails);
        
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
        running = false;
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

    isRunning() {
        return this.running;
    }
    
}