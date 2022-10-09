import { useState, useEffect } from "react";

export default function History({ history }) {

    const [clicks, setClicks] = useState([history])

    useEffect(() => {
        console.log(history);
        setClicks(history.clicks);
    }, [history]);

    return (
        <div className='History-container'>
            {clicks && clicks.map((click, index) => {
                return <p key={`item-${index}`}>{click.name}</p>
            })}
        </div>
    );
}