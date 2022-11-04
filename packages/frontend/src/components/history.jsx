import { useState, useEffect } from "react";

export default function History({ history, selectedDate }) {

    const [clicks, setClicks] = useState([history])
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        setClicks(history);
    }, [history]);

    useEffect(() => {
        setCurrentDate(selectedDate);
    }, [selectedDate]);

    function asFullDateString(date) {
        return `${asDayString(date)} ${date.toLocaleDateString()}`;
    }
    
    function asDayString(date) {
        if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
            return "for today";
        }
        return `on ${date.toLocaleDateString('en-US', { weekday: 'long' })}`;
    }

    function filterSelectedDate(clicks) {
        return clicks.filter(c => new Date(c.timestamp).toLocaleDateString() === currentDate.toLocaleDateString());
    }

    return (
        <div className='History-container container'>
            <div className="container-title">
                <span>Clix {currentDate && asFullDateString(currentDate)}</span>
            </div>
            <div className="container-body">
                <div className="history-table">
                    <table cellSpacing={10}>
                        <thead>
                            <tr>
                                <th scope="col">Timestamp</th>
                                <th scope="col">From</th>
                                <th scope="col">Account</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterSelectedDate(clicks).map((click, index) => {
                                return <tr key={`item-${index}`}>
                                            <td>{click.timestamp ? new Date(click.timestamp).toISOString().split('.')[0]: ''}</td>
                                            <td>{click.name}</td>
                                            <td>{click.account}</td>
                                        </tr> 
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}