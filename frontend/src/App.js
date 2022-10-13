import { useEffect, useState } from 'react';
import './App.css';
import Totals from './components/totals';
import History from './components/history';
import Remote from './components/remote';
import BackendService, { getStatistics } from './service/backend_service';
import Poller from './service/poller';

function App() {

    const backendService = new BackendService(process.env.REACT_APP_BACKEND_HOST);
    const [statistics, setStatistics] = useState();

    useEffect(() => {
        Poller.poll(async () => {
            initializeStatistics();
        }, 5000);
    }, []);

    function initializeStatistics() {
        backendService.getStatistics().then(response => {
            setStatistics(response.data);
        });
    }

    return (
        <div>
            <div className="App-header">
                <p className='title'>Clix Dashboard</p>
            </div>
            <div className='App-container'>
                {statistics &&
                    <div className='App-body'>
                        <div className='App-body-left'>
                            <Totals data={statistics} />
                            <Remote backendService={backendService} />
                        </div>
                         <div className='App-body-right'>
                            <History history={statistics.clicks} />
                        </div>
                    </div>
                }
             </div>
      </div>
    )
}

export default App;