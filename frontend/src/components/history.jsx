import { useState, useEffect } from "react";

export default function History({ history }) {

    const [clicks, setClicks] = useState([history])

    useEffect(() => {
        setClicks(history);
    }, [history]);

    return (
        <div className='History-container container'>
            <div className="container-title">
                <span>History (Last 100)</span>
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
                            {clicks.map((click, index) => {
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