import { useEffect, useState } from "react";
import Poller from "../service/poller";

export default function Console({ backendService }) {

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        Poller.poll(() => {
            backendService.getLogs().then(response => {
                setLogs(response.data);
            });
        }, 1000);
    }, [])

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