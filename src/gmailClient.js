import { google } from 'googleapis';
import axios from 'axios';
import Mail from './domain/mail.js';

export default class GmailClient {

    auth;
    oAuth2Client;
    config;

    constructor(config) {
        this.config = config;
        this.createOAuth2Client();
    }

    async getMessages() {
        try {
          const url = `https://gmail.googleapis.com/gmail/v1/users/${this.config.userId}/messages?labelIds=${this.config.labelId}`;
          return this.oAuth2Client.getAccessToken().then(async token => {
                const config = this.createGetConfig(url, token.token);
                return axios(config).then(async response => {
                    if (response.data.messages) {
                        let mails = [];
                        for (const messageId of response.data.messages) {
                            const mail = await this.getMessage(messageId.id).then(message => {
                                const from = message.payload.headers.find(header => {
                                    return header.name === 'From';
                                }).value;
                                let mailBody = '';
                                if (message.payload.parts) {
                                    for (const bodyPart of message.payload.parts) {
                                        mailBody += Buffer.from(bodyPart.body.data, 'base64').toString();
                                    }
                                } else {
                                    mailBody = Buffer.from(message.payload.body.data, 'base64').toString();
                                }
                                return new Mail(message.id, from, mailBody);
                            });
                            mails.push(mail);
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

    async getMessage(id) {
        try {
            const url = `https://gmail.googleapis.com//gmail/v1/users/${this.config.userId}/messages/${id}`;
            return this.oAuth2Client.getAccessToken().then(async token => {
                const config = this.createGetConfig(url, token.token);
                return axios(config).then(response => {
                    return response.data;
                }).catch(error => {
                    console.log(error.response.data);
                });
            });
          } catch (error) {
            console.log(error);
            return error;
          }
    }

    async deleteMessage(id) {
        try {
            const url = `https://gmail.googleapis.com//gmail/v1/users/${this.config.userId}/messages/${id}`;
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
            this.config.clientId,
            this.config.clientSecret,
            this.config.redirectUri
        );
        this.oAuth2Client.setCredentials({ refresh_token: this.config.refreshToken });
    }
}