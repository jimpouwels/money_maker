import { makeMoney } from "../service/backend_service";

export default function Remote() {

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
            </div>
        </div>
    );
}