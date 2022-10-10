import axios from 'axios';

export async function makeMoney() {
    return axios.post(`${process.env.REACT_APP_BACKEND_HOST}/make_money`);
}

export async function getStatistics() {
    return axios.get(`${process.env.REACT_APP_BACKEND_HOST}/statistics`);
}