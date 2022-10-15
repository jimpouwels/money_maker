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
import LoggerService from '../logger_service.js';

export default class MoneyMakerService {

    configs;
    urlExtractor;
    mailClicker;
    handlers;
    statisticsService;
    stateService;
    forwarders;

    constructor(configs, statisticsService, forwarders, stateService) {
        this.configs = configs;
        this.statisticsService = statisticsService;
        this.forwarders = forwarders;
        this.stateService = stateService;
        this.handlers = [];
        this.handlers.push(new ZinnGeldHandler('ZinnGeld'));
        this.handlers.push(new EuroClixHandler('EuroClix'));
        this.handlers.push(new OrangeBuddiesHandler('EnqueteClub', 'enqueteclub'));
        this.handlers.push(new OrangeBuddiesHandler('CashbackKorting', 'cashbackkorting'));
        this.handlers.push(new OrangeBuddiesHandler('LadyCashback', 'ladycashback'));
        this.handlers.push(new OrangeBuddiesHandler('GekkenGoud', 'gekkengoud'));
        this.handlers.push(new OrangeBuddiesHandler('IPay', 'ipay'));
        this.handlers.push(new OrangeBuddiesHandler('NuCash', 'nucash'));
        this.handlers.push(new GeldraceHandler('GeldRace'));
        this.handlers.push(new OnlineLeadsHandler('BespaarPortaal', 'bespaarportaal.nl'));
        this.handlers.push(new OnlineLeadsHandler('DirectVerdiend', 'directverdiend.nl'));
        this.handlers.push(new OnlineLeadsHandler('DoublePoints', 'doublepoints.nl', true));
        this.handlers.push(new ShopBuddiesHandler('ShopBuddies'));
        this.handlers.push(new QassaHandler('Qassa', 'qassa.nl'));
        this.urlExtractor = new UrlExtractor(this.handlers);
    }

    async makeMoney() {
        LoggerService.clear();
        this.stateService.setState('Running');
        this.stateService.setText('Initializing');
        for (const config of this.configs) {
            try {
                this.stateService.setText(`Creating client for ${config.userId}`);
                const client = this.getClient(config, this.forwarders);
                this.stateService.setText(`Finding cashmails`);
                let mailFilter = new MailFilter(this.handlers, client);
                let mailClicker = new MailClicker(this.handlers, client, this.statisticsService, this.stateService);
        
                LoggerService.log(`\n---SEARCHING CASH MAILS FOR ${config.userId}---`);
                const allMails = await client.getCashMails(config.labelId)
                const cashmails = mailFilter.filterCashMails(allMails);
        
                LoggerService.log('\n---SCANNING CASH MAILS FOR URLS---');
                this.urlExtractor.extractUrls(cashmails);
                
                LoggerService.log('\n---CLICKING CASH LINKS, MAKING MONEY!---');
                await mailClicker.openBrowser();
                for (const cashmail of cashmails) {
                    await mailClicker.click(cashmail);
                };
                this.statisticsService.removeExpiredClicks();

                await mailClicker.closeBrowser();
        
                LoggerService.log('\nAll cash URL\'s were clicked!');
            } catch (error) {
                if (error instanceof NoCashUrlsFoundError) {
                    LoggerService.log('ERROR: There were cashmails, but no cash URL\'s were found');
                } else if (error instanceof NoCashmailsFoundError) {
                    LoggerService.log('No cashmails found at this time, done!');
                } else if (error instanceof NoSuchClientError) {
                    LoggerService.log(`ERROR: Unknown mail type ${config.type}, skipping clicks for ${config.userId}`);
                    return;
                } else {
                    LoggerService.log(`ERROR: There was an unexpected error when making money:`, error);
                }
            }
            this.stateService.setState('Idle');
            this.stateService.setText('');
        }
        this.running = false;
    }
    
    getClient(config, forwarders) {
        if (config.type === 'gmail') {
            return new GmailClient(config.userId, 
                                    config.clientId, 
                                    config.clientSecret, 
                                    config.refreshToken, 
                                    config.redirectUri, 
                                    forwarders);
        }
        throw new NoSuchClientError();
    }
    
}