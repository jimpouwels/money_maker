import { useEffect, useState } from 'react';

export default function Totals({ data }) {

    let initialized = false;
    const [statistics, setStatistics] = useState(data);

    useEffect(() => {
        if (!initialized) {
            setStatistics(data);
            initialized = true;
        }
    }, [data]);

    return (
        <div className='Totals-container'>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">Total number of clicks:</th>
                        <td>{statistics.totalClicks}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}