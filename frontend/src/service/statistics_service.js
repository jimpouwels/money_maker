import axios from 'axios';

export async function getStatistics() {
    return axios.get('http://localhost:9999/statistics_new');
}