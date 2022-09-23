import GmailClient from '../../clients/gmail_client.js';
import EnqueteClubMatcher from './url_matchers/enqueteclub_matcher.js';
import ZinnGeldMatcher from './url_matchers/zinngeld_matcher.js';
import EuroClixMatcher from './url_matchers/euroclix_matcher.js';
import CashbackKortingMatcher from './url_matchers/cashbackkorting_matcher.js';
import LadyCashbackMatcher from './url_matchers/ladycashback_matcher.js';
import GekkengoudMatcher from './url_matchers/gekkengoud_matcher.js';
import IPayMatcher from './url_matchers/ipay_matcher.js';
import GeldraceMatcher from './url_matchers/geldrace_matcher.js';
import MailFilter from './mail_filter.js';
import NoCashmailsFoundError from './error/no_cashmails_found_error.js';
import UrlExtractor from './url_extractor.js';
import NoCashUrlsFoundError from './error/no_cashurls_found_error.js';
import MailClicker from './mail_clicker.js';
import NoSuchClientError from './error/no_such_client_error.js';
import NuCashMatcher from './url_matchers/nucash_matcher.js';

export default class MoneyMakerService {

    configs;
    mailFilter;
    urlExtractor;
    mailClicker;
    matchers;

    constructor(configs) {
        this.configs = configs;
        this.matchers = [];
        this.matchers.push(new EnqueteClubMatcher());
        this.matchers.push(new ZinnGeldMatcher());
        this.matchers.push(new EuroClixMatcher());
        this.matchers.push(new CashbackKortingMatcher());
        this.matchers.push(new LadyCashbackMatcher());
        this.matchers.push(new GekkengoudMatcher());
        this.matchers.push(new IPayMatcher());
        this.matchers.push(new GeldraceMatcher());
        this.matchers.push(new NuCashMatcher());
        this.mailFilter = new MailFilter(this.matchers);
        this.urlExtractor = new UrlExtractor(this.matchers);
    }

    async makeMoney() {
        for (const config of this.configs) {
            try {
                const client = this.getClient(config);
                let mailClicker = new MailClicker(this.matchers, client);
        
                console.log(`\n---SEARCHING CASH MAILS FOR ${config.userId}---`);
                const allMails = await client.getCashMails(config.labelId)
                const cashmails = this.mailFilter.filterCashMails(allMails);
        
                console.log('\n---SCANNING CASH MAILS FOR URLS---');
                this.urlExtractor.extractUrls(cashmails);
                
                console.log('\n---CLICKING CASH LINKS, MAKING MONEY!---');
                for (const cashmail of cashmails) {
                    await mailClicker.click(cashmail);
                };
        
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
                    console.log(`ERROR: There was an unexpected error when extracting cash URL\'s:`, error);
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