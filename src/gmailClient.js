import { google } from 'googleapis';
import axios from 'axios';

export default class GmailClient {

    auth;
    oAuth2Client;

    constructor() {
        this.createAuth();
        this.createOAuth2Client();
    }

    async getMessages() {
        try {
          const url = `https://gmail.googleapis.com/gmail/v1/users/jim.pouwels@gmail.com/messages?labelIds=Label_4918427780235740182`;
          return this.oAuth2Client.getAccessToken().then(async token => {
                const config = this.createGetConfig(url, token.token);
                return axios(config).then(response => {
                    if (response.data.messages) {
                        return response.data.messages;
                    } else {
                        return [];
                    }
                }).catch(error => {
                    console.log(error.response.data);
                });
          });
        } catch (error) {
          console.log(error);
          return error;
        }
    }

    async getMessage(id) {
        try {
            const url = `https://gmail.googleapis.com//gmail/v1/users/jim.pouwels@gmail.com/messages/${id}`;
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
            const url = `https://gmail.googleapis.com//gmail/v1/users/jim.pouwels@gmail.com/messages/${id}`;
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

    createAuth() {
        this.auth = {
            type: "OAuth2",
            user: "jim.pouwels@gmail.com",
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        };
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
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );
        this.oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    }
}