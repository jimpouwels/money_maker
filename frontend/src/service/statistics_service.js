import axios from 'axios';

export async function getStatistics() {
    return axios.get(`${process.env.REACT_APP_BACKEND_HOST}/statistics`);
}