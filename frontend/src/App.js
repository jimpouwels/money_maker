import { useEffect, useState } from 'react';
import './App.css';
import Totals from './components/totals';
import History from './components/history';
import Remote from './components/remote';
import Console from './components/console';
import BackendService from './service/backend_service';

function App() {

    const backendService = new BackendService(process.env.REACT_APP_BACKEND_PORT);
    const [tmpData, setTmpData] = useState();
    const [statistics, setStatistics] = useState();
    const [error, setError] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        initialize();
        const interval = setInterval(async () => {
            await initialize();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (tmpData) {
            if (!statistics || tmpData.timestamp !== statistics.timestamp) {
                setError(null);
                setStatistics(tmpData);
            }
        }
    }, [tmpData]);

    async function initialize() {
        await backendService.getStatistics().then(response => {
            setTmpData(response.data);
        }).catch(_error => {
            setStatistics(null);
            setError("Cannot connect to backend");
        });
    }

    function onDateSelected(selectedDate) {
        setSelectedDate(selectedDate)
    }

    return (
        <div>
            <div className="App-header">
                <p className='title'>Clix Dashboard</p>
                <hr/>
            </div>
            <div className="App-container">
                {statistics &&
                    <div className="App-body">
                        <div className="App-body-left">
                            <Totals data={statistics} onDateSelected={onDateSelected} />
                            <Remote backendService={backendService} />
                        </div>
                         <div className="App-body-right">
                            <History history={statistics.clicks} selectedDate={selectedDate} />
                        </div>
                        <div className="App-body-bottom">
                            <Console backendService={backendService} />
                        </div>
                    </div>
                }
                {error && 
                    <div className="Error-container">Error: Could not connect to backend</div>
                }
             </div>
      </div>
    )
}

export default App;