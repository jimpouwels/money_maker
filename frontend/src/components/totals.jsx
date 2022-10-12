import { useEffect, useState } from 'react';

export default function Totals({ data }) {

    const [clixToday, setClixToday] = useState(0);

    useEffect(() => {
        let totalToday = 0;
        let today = new Date();
        for (const click of data.clicks) {
            if (new Date(click.timestamp).toDateString() !== today.toDateString()) {
                break;
            }
            totalToday++;
        }
        setClixToday(totalToday);
    }, [data]);

    function round(number) {
        return Math.round((number + Number.EPSILON) * 100) / 100
    }

    function toString(number) {
        return String(round(number)).replace('.', ',')
    }

    return (
        <div className='Totals-container container'>
            <div className='container-title'>
                <span>Overview</span>
            </div>
            <div className='container-body'>
                <table>
                    <tbody>
                        <tr>
                            <th scope="row">Total clix:</th>
                            <td>{String(data.totalClicks)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Clix today:</th>
                            <td>{clixToday}</td>
                        </tr>
                        <tr>
                            <th scope="row">Minimum profit:</th>
                            <td>&euro; {toString(data.totalClicks * 0.005)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Maximum profit:</th>
                            <td>&euro; {toString(data.totalClicks * 0.01)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}