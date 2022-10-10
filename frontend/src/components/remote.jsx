import { useEffect, useState } from "react";
import { getState, makeMoney } from "../service/backend_service";

export default function Remote() {

    const [state, setState] = useState('');

    useEffect(() => {
        const interval = setInterval(async () => {
            await getState().then(response => {
                setState(response.data.state);
            });
        }, 1000);
        return () => clearInterval(interval)
    });
    
    function triggerMakeMoney() {
        makeMoney();
    }
    
    return (
        <div className='Remote-container container'>
            <div className='container-title'>
                <span>Remote Control</span>
            </div>
            <div className='container-body'>
                <button onClick={() => triggerMakeMoney()}>Make Money!</button>
                <span className="state-text">{state}</span>
            </div>
        </div>
    );
}