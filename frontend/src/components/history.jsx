import { useState, useEffect } from "react";

export default function History({ history }) {

    const [clicks, setClicks] = useState([history])

    useEffect(() => {
        setClicks(history.clicks);
    }, [history]);

    return (
        <div className='History-container'>
            {clicks &&
                <table cellPadding={5}>
                    <thead>
                        <tr>
                            <th scope="col">
                                Timestamp
                            </th>
                            <th scope="col">
                                From
                            </th>
                            <th scope="col">
                                Account
                            </th>
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
            }
        </div>
    );
}