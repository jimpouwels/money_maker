import axios from 'axios';

export default class BackendService {

    backendPort;

    constructor(backendPort) {
        this.backendPort = backendPort;
    }

    async makeMoney() {
        return axios.post(`http://${window.location.host.split(':')[0]}:${this.backendPort}/make_money`);
    }

    async getStatistics() {
        console.log(`http://${window.location.host.split(':')[0]}:${this.backendPort}/statistics`);
        return axios.get(`http://${window.location.host.split(':')[0]}:${this.backendPort}/statistics`);
    }
    
    async getState() {
        return axios.get(`http://${window.location.host.split(':')[0]}:${this.backendPort}/state`);
    }

    async getLogs() {
        return axios.get(`http://${window.location.host.split(':')[0]}:${this.backendPort}/log`);
    }
}
