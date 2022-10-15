import { useState, useEffect } from "react";

export default function History({ history }) {

    const [clicks, setClicks] = useState([history])
    const [today, setToday] = useState(new Date());

    useEffect(() => {
        setClicks(history);
    }, [history]);

    function asDayString(date) {
        if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
            return "for today";
        }
        return `on ${date.toLocaleDateString('en-US', { weekday: 'long' })}`;
    }

    function asDateString(date) {
        return date.toLocaleDateString();
    }

    return (
        <div className='History-container container'>
            <div className="container-title">
                <span>Clix {today && asDayString(today)} ({today && asDateString(today)})</span>
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
                            {clicks.filter(c => new Date(c.timestamp).toLocaleDateString() === today.toLocaleDateString()).map((click, index) => {
                                return <tr key={`item-${index}`}>
                                            <td>{click.timestamp ? new Date(click.timestamp).toISOString().split('.')[0]: ''}</td>
                                            <td>{click.name}</td>
                                            <td>{click.subscriber}</td>
                                        </tr> 
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}