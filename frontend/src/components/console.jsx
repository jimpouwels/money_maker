import { useEffect, useState } from "react";

export default function Console({ backendService }) {

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        initialize();
        const interval = setInterval(async () => {
            await initialize();
        }, 1000);
        return () => clearInterval(interval);
    }, [backendService])

    async function initialize() {
        await backendService.getLogs().then(response => {
            setLogs(response.data);
        });
    }

    return (
        <div className='Console-container container'>
            <div className="container-title">
                <span>Console (last run)</span>
            </div>
            <div className="container-body">
                <div className="console-container">
                    {logs.map((log, index) => {
                        return <p key={`log-${index}`}>{log}</p>
                    })}
                </div>
            </div>
        </div>
    );
}