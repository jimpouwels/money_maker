import { useEffect, useState } from 'react';

export default function Totals({ data, onDateSelected }) {

    const MAX_HISTORY_IN_DAYS = 7;
    const [clixToday, setClixToday] = useState(0);
    const [clixPerDay, setClixPerDay] = useState([]);
    const [selectedDay, setSelectedDay] = useState(7);

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
        updateClixPerDay();
    }, [data]);

    function updateClixPerDay() {
        let clixPerDay = [];
        for (let i = 0; i <= MAX_HISTORY_IN_DAYS; i++) {
            clixPerDay[i] = 0;
            let dateToCompareTo = new Date();
            dateToCompareTo.setDate(dateToCompareTo.getDate() - i);
            for (let click of data.clicks) {
                if (new Date(click.timestamp).toDateString() === dateToCompareTo.toDateString()) {
                    clixPerDay[i]++;
                }
            }
        }
        setClixPerDay(clixPerDay);
    }

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

    function selectDaysAgo(dayIndex) {
        if (dayIndex !== selectedDay) {
            setSelectedDay(dayIndex);
            const selectedDate = new Date();
            selectedDate.setDate(selectedDate.getDate() - Math.abs(dayIndex - 7));
            onDateSelected(selectedDate)
        }
    }

    return (
        <div className='Totals-container container'>
            <div className='container-title'>
                <span>Overview</span>
            </div>
            <div className='container-body'>
                <table className='totals-table' cellSpacing={5}>
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
                <table cellSpacing={5} className="totals-last-week">
                    <tbody>
                        <tr>
                            {[...Array(MAX_HISTORY_IN_DAYS + 1)].map((e, i) => {
                                return <th key={i} onClick={() => selectDaysAgo(i)} scope="col" className={i === selectedDay ? "": "unselected"}>{getDayOfDaysAgo(MAX_HISTORY_IN_DAYS - i)}</th>
                            })}
                        </tr>
                        <tr>
                            {[...Array(MAX_HISTORY_IN_DAYS + 1)].map((e, i) => {
                                return <td key={i}>{clixPerDay[MAX_HISTORY_IN_DAYS - i]}</td>
                            })}       
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}