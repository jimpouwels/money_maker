import { useState, useEffect } from "react";

export default function History({ history }) {

    const [clicks, setClicks] = useState([history])

    useEffect(() => {
        setClicks(history.clicks);
    }, [history]);

    return (
        <div className='History-container'>
            {clicks && clicks.map((click, index) => {
                return <p key={`item-${index}`}>{click.timestamp ? new Date(click.timestamp).toISOString(): ''}: {click.name}</p>
            })}
        </div>
    );
}