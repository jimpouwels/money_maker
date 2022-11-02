import { google } from "googleapis";
import axios from "axios";
import Mail from "../domain/mail";

export default class GmailClient {

    private _oAuth2Client: any;
    private _userId: string;
    private _clientId: string;
    private _clientSecret: string;
    private _refreshToken: string;
    private _redirectUri: string;
    private _forwarders: string[];

    public constructor(userId: string, clientId: string, clientSecret: string, refreshToken: string, redirectUri: string, forwarders: string[]) {
        this.userId = userId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
        this.redirectUri = redirectUri;
        this.forwarders = forwarders;
        this.createOAuth2Client();
    }

    public async getCashMails(labelId: string): Promise<Mail[]> {
        try {
          const url = `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/messages?labelIds=${labelId}`;
          return this.oAuth2Client.getAccessToken().then(async (token: any) => {
                const config = this.createGetConfig(url, token.token);
                return axios(config).then(async (response: any) => {
                    if (response.data.messages) {
                        let mails = [];
                        for (const messageId of response.data.messages) {
                            mails.push(await this.getMail(messageId.id));
                        }
                        return mails;
                    } else {
                        return [];
                    }
                }).catch((error: any) => {
                    if (error.response) {
                        console.log(error.response.data);
                    } else {
                        console.log(error);
                    }
                });
          });
        } catch (error: any) {
          console.log(error);
          return error;
        }
    }

    public async getMail(id: string): Promise<Mail> {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/messages/${id}`;
        return this.oAuth2Client.getAccessToken().then(async (token: any) => {
            const config = this.createGetConfig(url, token.token);
            return axios(config).then((response: any) => {
                const message = response.data;
                let sender = this.getSender(message);
                return new Mail(message.id, this.getFrom(message, sender), this.getAccountFrom(sender), this.getBodyFrom(message), this.getSubjectFrom(message));
            }).catch((error: any) => {
                console.log(`Error loading mail: ${JSON.stringify(error)}`);
            });
        });
    }

    public async deleteMail(id: string): Promise<void> {
        const url = `https://gmail.googleapis.com//gmail/v1/users/${this.userId}/messages/${id}`;
        return this.oAuth2Client.getAccessToken().then(async (token: any) => {
            const config = this.createDeleteConfig(url, token.token);
            return axios(config).then((_response: any) => {
                return;
            }).catch((error: any) => {
                console.log(error.response.data);
            });
        });
    }

    private createGetConfig(url: string, accessToken: string): any {
        return {
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-type": "application/json",
            },
        };
    }

    private createDeleteConfig(url: string, accessToken: string): any {
        return {
            method: "delete",
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };
    }

    private createOAuth2Client(): void {
        this.oAuth2Client = new google.auth.OAuth2(
            this.clientId,
            this.clientSecret,
            this.redirectUri
        );
        this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken });
    }

    private getBodyFrom(mail: any): string {
        let mailBody = '';
        if (mail.payload.parts) {
            for (const bodyPart of mail.payload.parts) {
                mailBody += Buffer.from(bodyPart.body.data, 'base64').toString();
            }
        } else {
            mailBody = Buffer.from(mail.payload.body.data, 'base64').toString();
        }
        return mailBody;
    }

    private getSubjectFrom(mail: any): string {
        return mail.payload.headers.find((header: any) => {
            return header.name === 'Subject';
        }).value;
    }

    private getFrom(mail: any, sender: string): string {
        if (this.forwarders.includes(sender)) {
            return this.getOriginatingFrom(mail);
        }
        return sender;
    }

    private getAccountFrom(sender: string): string {
        return this.forwarders.includes(sender) ? sender : this.userId;
    }

    private getSender(mail: any): string {
        return mail.payload.headers.find((header: any) => {
            return header.name === 'From';
        }).value.split('<')[1].slice(0, -1);
    }

    private getOriginatingFrom(mail: any): string {
        return mail.snippet.match(/(?<=&lt;).+(?=&gt;)/)[0];
    }

    private get oAuth2Client(): any {
        return this._oAuth2Client;
    }

    private set oAuth2Client(oAuth2Client: any) {
        this._oAuth2Client = oAuth2Client;
    }

    private get userId(): string {
        return this._userId;
    }

    private set userId(userId: string) {
        this._userId = userId;
    }

    private get clientId(): string {
        return this._clientId;
    }

    private set clientId(clientId: string) {
        this._clientId = clientId;
    }

    private get clientSecret(): string {
        return this._clientSecret;
    }

    private set clientSecret(clientSecret: string) {
        this._clientSecret = clientSecret;
    }

    private get refreshToken(): string {
        return this._refreshToken;
    }

    private set refreshToken(refreshToken: string) {
        this._refreshToken = refreshToken;
    }

    private get redirectUri(): string {
        return this._redirectUri;
    }

    private set redirectUri(redirectUri: string) {
        this._redirectUri = redirectUri;
    }

    private get forwarders(): string[] {
        return this._forwarders;
    }

    private set forwarders(forwarders: string[]) {
        this._forwarders = forwarders;
    }
}