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

    function getDayOfDaysAgo(daysAgo) {
        let now = new Date();
        now.setDate(now.getDate() - daysAgo);
        return now.toLocaleDateString('en-US', { weekday: 'short' });
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
                <p>Clix last week:</p>
                <table cellSpacing={5} className="totals-last-week">
                    <tbody>
                        <tr>
                            {[...Array(8)].map((e, i) => {
                                return <th key={i} scope="col" className={i === 7 ? "today": "past"}>{getDayOfDaysAgo(7 - i)}</th>
                            })}
                        </tr>
                        <tr>
                            {[...Array(8)].map((e, i) => {
                                return <td key={i}>0</td>
                            })}       
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}