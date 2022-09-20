import GmailClient from './clients/gmail_client.js';
import fs from 'fs';
import path from 'path';
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

if (process.env.MACBOOK === 'true') {
    console.log('Running on Macbook...');
} else {
    console.log('Running on RaspBerry');
}

console.log('Reading mail configurations...')
const configs = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')));
const matchers = [];
matchers.push(new EnqueteClubMatcher());
matchers.push(new ZinnGeldMatcher());
matchers.push(new EuroClixMatcher());
matchers.push(new CashbackKortingMatcher());
matchers.push(new LadyCashbackMatcher());
matchers.push(new GekkengoudMatcher());
matchers.push(new IPayMatcher());
matchers.push(new GeldraceMatcher());

const mailFilter = new MailFilter(matchers);
const urlExtractor = new UrlExtractor(matchers);
const mailClicker = new MailClicker();

for (const config of configs) {
    makeMoney(config, matchers);
}

async function makeMoney(config) {
    try {
        const client = getClient(config);

        console.log(`\n---SEARCHING CASH MAILS FOR ${config.userId}---`);
        const allMails = await client.getCashMails(config.labelId)
        const cashMails = mailFilter.filterCashMails(allMails);

        console.log('\n---SCANNING CASH MAILS FOR URLS---');
        let cashUrls = urlExtractor.extractUrls(cashMails);
        
        console.log('\n---CLICKING CASH LINKS, MAKING MONEY!---');
        await mailClicker.clickLinks(cashUrls);

        console.log('\nAll cash URL\'s were clicked!');
        console.log('\n---DELETE CASH MAILS---');
        deleteMails(client, cashMails);
    } catch (error) {
        if (error instanceof NoCashUrlsFoundError) {
            console.log('ERROR: There were cashmails, but no cash URL\'s were found');
        } else if (error instanceof NoCashmailsFoundError) {
            console.log('No cashmails found at this time, done!');
        } else if (error instanceof NoSuchClientError) {
            console.log(`ERROR: Unknown mail type ${config.type}, skipping clicks for ${config.userId}`);
            return;
        } else {
            console.log(`ERROR: There was an unexpected error when extracting cash URL\'s: ${error}`);
        }
        process.exit();
    }
}

function getClient(config) {
    if (config.type === 'gmail') {
        return new GmailClient(config.userId, 
                                config.clientId, 
                                config.clientSecret, 
                                config.refreshToken, 
                                config.redirectUri);
    }
    throw new NoSuchClientError();
}

async function deleteMails(client, cashmails) {
    for (const cashmail of cashmails) {
        if (!cashmail.linksFound) {
            console.log(`No links were found for ${cashmail.from}, keeping the mail for review...`)
            continue;
        }
        await client.deleteMail(cashmail.id);
        console.log(`Mail from ${cashmail.from} deleted`);
    }
}