import { google } from 'googleapis';
import axios from 'axios';
import Mail from './domain/mail.js';

export default class GmailClient {

    auth;
    oAuth2Client;
    userId;
    clientId;
    clientSecret;
    refreshToken;
    redirectUri;

    constructor(userId, clientId, clientSecret, refreshToken, redirectUri) {
        this.userId = userId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
        this.redirectUri = redirectUri;
        this.createOAuth2Client();
    }

    async getCashMails(labelId) {
        try {
          const url = `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/messages?labelIds=${labelId}`;
          return this.oAuth2Client.getAccessToken().then(async token => {
                const config = this.createGetConfig(url, token.token);
                return axios(config).then(async response => {
                    if (response.data.messages) {
                        let mails = [];
                        for (const messageId of response.data.messages) {
                            mails.push(await this.getMail(messageId.id));
                        }
                        return mails;
                    } else {
                        return [];
                    }
                }).catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                    } else {
                        console.log(error);
                    }
                });
          });
        } catch (error) {
          console.log(error);
          return error;
        }
    }

    async getMail(id) {
        try {
            const url = `https://gmail.googleapis.com//gmail/v1/users/${this.userId}/messages/${id}`;
            return this.oAuth2Client.getAccessToken().then(async token => {
                const config = this.createGetConfig(url, token.token);
                return axios(config).then(response => {
                    const message = response.data;
                    return new Mail(message.id, this.getSenderFrom(message), this.getBodyFrom(message));
                }).catch(error => {
                    console.log(error.response.data);
                });
            });
          } catch (error) {
            console.log(error);
            return error;
          }
    }

    async deleteMail(id) {
        try {
            const url = `https://gmail.googleapis.com//gmail/v1/users/${this.userId}/messages/${id}`;
            return this.oAuth2Client.getAccessToken().then(async token => {
                const config = this.createDeleteConfig(url, token.token);
                return axios(config).then(_response => {
                    return;
                }).catch(error => {
                    console.log(error.response.data);
                });
            });
          } catch (error) {
            console.log(error);
            return error;
          }
    }

    createGetConfig(url, accessToken) {
        return {
            method: "get",
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-type": "application/json",
            },
        };
    }

    createDeleteConfig(url, accessToken) {
        return {
            method: "delete",
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };
    }

    createOAuth2Client() {
        this.oAuth2Client = new google.auth.OAuth2(
            this.clientId,
            this.clientSecret,
            this.redirectUri
        );
        this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken });
    }

    getBodyFrom(mail) {
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

    getSenderFrom(mail) {
        return mail.payload.headers.find(header => {
            return header.name === 'From';
        }).value;
    }
}