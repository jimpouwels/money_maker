import { useEffect, useState } from "react";

export default function Remote({ backendService }) {

    const [state, setState] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        initialize();
        const interval = setInterval(async () => {
            await initialize();
        }, 1000);
        return () => clearInterval(interval);
    }, [backendService]);

    useEffect(() => {
        setButtonDisabled(state.state === 'Running');
    }, [state]);

    async function initialize() {
        await backendService.getState().then(response => {
            setState(response.data);
        });
    }
    
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
                <span className="state-text">{state.text}</span>
            </div>
        </div>
    );
}