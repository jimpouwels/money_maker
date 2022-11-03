import axios from 'axios';

export default class BackendService {

    backendPort;

    constructor(backendPort) {
        this.backendPort = backendPort;
    }

    async makeMoney() {
        return axios.post(`${window.location.host}:${this.backendPort}/make_money`);
    }

    async getStatistics() {
        console.log(`${window.location.host}:${this.backendPort}/statistics`);
        return axios.get(`${window.location.host}:${this.backendPort}/statistics`);
    }
    
    async getState() {
        return axios.get(`${window.location.host}:${this.backendPort}/state`);
    }

    async getLogs() {
        return axios.get(`${window.location.host}:${this.backendPort}/log`);
    }
}
