import Handler from './handlers/handler';
import StatisticsService from '../statistics_service';
import StateService from '../state_service';
import NoCashmailsFoundError from './error/no_cashmails_found_error';
import UrlExtractor from './url_extractor';
import MailClicker from './mail_clicker';
import NoSuchClientError from './error/no_such_client_error';
import ZinnGeldHandler from './handlers/zinngeld_handler';
import EuroClixHandler from './handlers/euroclix_handler';
import GeldraceHandler from './handlers/geldrace_handler';
import OnlineLeadsHandler from './handlers/onlineleads_handler';
import ShopBuddiesHandler from './handlers/shopbuddies_handler';
import OrangeBuddiesHandler from './handlers/orangebuddies_handler';
import QassaHandler from './handlers/qassa_handler';
import LoggerService from '../logger_service';
import GmailClient from '../../clients/gmail_client';
import MailClient from '../../clients/mail_client';
import MailFilter from './mail_filter';
import NoCashUrlsFoundError from './error/no_cashurls_found_error';
import Mail from '../../domain/mail';

export default class MoneyMakerService {

    private _configs: any;
    private _urlExtractor: UrlExtractor;
    private _handlers: Handler[];
    private _statisticsService: StatisticsService;
    private _stateService: StateService;
    private _forwarders: string[];
    private _isRunning: boolean;

    constructor(configs: any, statisticsService: StatisticsService, forwarders: string[], stateService: StateService) {
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
        this.handlers.push(new QassaHandler('Qassa'));
        this.urlExtractor = new UrlExtractor();
    }

    async makeMoney(): Promise<void> {
        LoggerService.clear();
        this.stateService.state = 'Running';
        this.stateService.text = 'Initializing';
        for (const config of this.configs) {
            try {
                this.stateService.text = `Creating client for ${config.userId}`;
                const client = this.getClient(config, this.forwarders);
                this.stateService.text = `Finding cashmails`;
                let mailFilter = new MailFilter(this.handlers, client);
        
                const processedMails: string[] = [];
                
                while (true) {
                    LoggerService.log(`\n---SEARCHING CASH MAILS FOR ${config.userId}---`);
                    const cashmails = await this.getAllCashMails(client, config, mailFilter);

                    const unprocessedMails = cashmails.filter(m => !processedMails.includes(m.id));
                    if (unprocessedMails.length == 0) {
                        break;
                    }

                    LoggerService.log('\n---SCANNING CASH MAILS FOR URLS---');
                    this.urlExtractor.extractUrls(unprocessedMails);
                    
                    LoggerService.log('\n---CLICKING CASH LINKS, MAKING MONEY!---');
                    await this.clickMails(client, unprocessedMails);
                    
                    this.statisticsService.removeExpiredClicks();
            
                    processedMails.push(...unprocessedMails.map(m => m.id));
                }

                LoggerService.log('\nAll cash URL\'s were clicked!');
            } catch (error: any) {
                if (error instanceof NoCashUrlsFoundError) {
                    LoggerService.log('ERROR: There were cashmails, but no cash URL\'s were found');
                } else if (error instanceof NoCashmailsFoundError) {
                    LoggerService.log('No cashmails found at this time, done!');
                } else if (error instanceof NoSuchClientError) {
                    LoggerService.log(`ERROR: Unknown mail type ${config.type}, skipping clicks for ${config.userId}`);
                    return;
                } else {
                    LoggerService.logError(`ERROR: There was an unexpected error when making money`, error);
                }
            }
            this.stateService.state = 'Idle';
            this.stateService.text = '';
        }
        this.running = false;
    }

    private async clickMails(client: MailClient, cashmails: Mail[]): Promise<void> {
        let mailClicker = new MailClicker(this.handlers, client, this.statisticsService, this.stateService);
        return mailClicker.openBrowser().then(async() => {
            for (const cashmail of cashmails) {
                await mailClicker.click(cashmail).catch(error => {
                    LoggerService.logError(`ERROR: This mail could not be clicked due to an error`, error);
                });
            };
            await mailClicker.closeBrowser();
        });
    }

    private getClient(config: any, forwarders: string[]): MailClient {
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
    
    private async getAllCashMails(client: MailClient, config: any, mailFilter: MailFilter): Promise<Mail[]> {
        return client.getCashMails(config.labelId).then(allMails => {
            return mailFilter.filterCashMails(allMails);
        });
    }

    private get handlers(): Handler[] {
        return this._handlers;
    }

    private set handlers(handlers: Handler[]) {
        this._handlers = handlers;
    }

    private get configs(): any {
        return this._configs;
    }

    private set configs(configs: any) {
        this._configs = configs;
    }

    private get statisticsService(): StatisticsService {
        return this._statisticsService;
    }

    private set statisticsService(statisticsService: StatisticsService) {
        this._statisticsService = statisticsService;
    }

    private get forwarders(): string[] {
        return this._forwarders;
    }

    private set forwarders(forwarders: string[]) {
        this._forwarders = forwarders;
    }

    private get stateService(): StateService {
        return this._stateService;
    }

    private set stateService(stateService: StateService) {
        this._stateService = stateService;
    }

    private get urlExtractor(): UrlExtractor {
        return this._urlExtractor;
    }

    private set urlExtractor(urlExtractor: UrlExtractor) {
        this._urlExtractor = urlExtractor;
    }

    private get running(): boolean {
        return this._isRunning;
    }

    private set running(isRunning: boolean) {
        this._isRunning = isRunning;
    }
    
}
