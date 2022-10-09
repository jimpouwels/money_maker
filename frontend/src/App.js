import { useEffect, useState } from 'react';
import './App.css';
import Totals from './components/totals';
import History from './components/history';
import { getStatistics } from './service/statistics_service';

function App({ }) {

    let initialized = false;
    const [stuff, setStuff] = useState([]);

    useEffect(() => {
        if (!initialized) {
            initStatistics();
            initialized = true;
        }
    }, []);

    async function initStatistics() {
        await getStatistics().then(response => {
          console.log(response.data);
          setStuff(response.data);
        })
    }

    return (
      <div>
        <div className="App-header">
            <p className='title'>Clix Dashboard</p>
        </div>
        <div className='App-container'>
            <div className='App-body'>
                <Totals data={stuff} />
                <History history={stuff} />
            </div>
        </div>
      </div>
    )
}

export default App;