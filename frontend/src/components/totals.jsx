import { useEffect, useState } from 'react';

export default function Totals({ data }) {

    const [statistics, setStatistics] = useState(data);

    useEffect(() => {
        setStatistics(data);
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
                            <td>{String(statistics.totalClicks)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Total profit (min):</th>
                            <td>&euro; {String(statistics.totalClicks * 0.005)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Total profit (max):</th>
                            <td>&euro; {String(statistics.totalClicks * 0.01)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}