import { useEffect, useState } from "react";
import Poller from "../service/poller";

export default function Remote({ backendService }) {

    const [state, setState] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        Poller.poll(async () => {
            await backendService.getState().then(response => {
                setState(response.data);
            });
        }, 1000);
    }, [backendService]);

    useEffect(() => {
        setButtonDisabled(state.state === 'Running');
    }, [state])
    
    function triggerMakeMoney() {
        setButtonDisabled(true);
        backendService.makeMoney();
    }
    
    return (
        <div className='Remote-container container'>
            <div className='container-title'>
                <span>Remote Control</span>
            </div>
            <div className='container-body'>
                <button disabled={isButtonDisabled} onClick={() => triggerMakeMoney()}>
                    {isButtonDisabled ? 
                        <img src={"./spinner.gif"} height="10" width="10" />
                        : 'Make Money'
                    }
                </button>
                <span className="state-text">{state.state}{state.text ? ` - ${state.text}` : ''}</span>
            </div>
        </div>
    );
}