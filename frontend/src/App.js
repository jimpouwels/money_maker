import { useEffect, useState } from 'react';
import './App.css';
import Totals from './components/totals';
import History from './components/history';
import { getStatistics } from './service/statistics_service';

function App({ }) {

    let initialized = false;
    const [statistics, setStatistics] = useState([]);

    useEffect(() => {
        if (!initialized) {
            getStatistics().then(response => {
              setStatistics(response.data);
            });
            initialized = true;
        }
    }, []);

    return (
      <div>
        <div className="App-header">
            <p className='title'>Clix Dashboard</p>
        </div>
        <div className='App-container'>
            {statistics &&
              <div className='App-body'>
                  <Totals data={statistics} />
                  <History history={statistics} />
              </div>
            }
        </div>
      </div>
    )
}

export default App;