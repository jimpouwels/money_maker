import { useEffect, useState, useRef } from 'react';

export default function Totals({ data }) {

    let initialized = useRef(false);
    const [statistics, setStatistics] = useState(data);

    useEffect(() => {
        if (!initialized.current) {
            setStatistics(data);
            initialized.current = true;
        }
    }, [data]);

    return (
        <div className='Totals-container container'>
            <div className='container-title'>
                <span>Overview</span>
            </div>
            <div className='container-body'>
                <table>
                    <tbody>
                        <tr>
                            <th scope="row">Total number of clicks:</th>
                            <td>{statistics.totalClicks}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}