import { useEffect, useState } from "react";
import { getState, makeMoney } from "../service/backend_service";

export default function Remote() {

    const [state, setState] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            await getState().then(response => {
                setState(response.data);
            });
        }, 1000);
        return () => clearInterval(interval)
    });

    useEffect(() => {
        setButtonDisabled(state.state === 'Running');
    }, [state])
    
    function triggerMakeMoney() {
        setButtonDisabled(true);
        makeMoney();
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
                        : 'Make Money!'
                    }
                </button>
                <span className="state-text">{state.state}{state.text ? ` - ${state.text}` : ''}</span>
            </div>
        </div>
    );
}