import axios from 'axios';

export default class BackendService {

    host;

    constructor(host) {
        this.host = host;
    }

    async makeMoney() {
        return axios.post(`${this.host}/make_money`);
    }
    
    async getStatistics() {
        return axios.get(`${this.host}/statistics`);
    }
    
    async getState() {
        return axios.get(`${this.host}/state`);
    }
}
