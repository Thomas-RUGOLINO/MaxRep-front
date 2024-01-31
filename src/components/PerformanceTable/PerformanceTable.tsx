import './PerformanceTable.scss';
import { convertSecondsToHMS  } from '../../utils/convertTime';
import { convertDateFormatToEu } from '../../utils/formatDate';

interface PerformanceTableProps { 
    displaySelectedSport:SportProps
}

interface SportProps {
    id:number,
    name:string,
    unit:string,
    sessions:SessionProps[]
}

interface SessionProps {
    id:number,
    date:string,
    description:string,
    score:number,
    user_id:number,
    sport_id:number,
}

const PerformanceTable = ({displaySelectedSport}: PerformanceTableProps) => { 
    return (
        <>
        {displaySelectedSport.sessions.length > 0 ? (
            <>
                <h3 className='table-title'> 5 dernières sessions </h3>
                <div className='table'>
                    <table className='performance-board'>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                        {displaySelectedSport.sessions.slice(-5).map((item: SessionProps, index) => (
                                <tr key={index}>
                                    <td>{convertDateFormatToEu(new Date(item.date))}</td>
                                    <td>
                                        {displaySelectedSport.unit === 'temps' ? (
                                        convertSecondsToHMS(item.score)
                                        ) : (
                                            item.score + ' kg'
                                        )}
                                    </td> 
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        ) : (
            <p className='no-sessions-message'> Vous n'avez pas encore de score enregistré pour ce sport ! </p>
        )}
        
        </>
    )
}

export default PerformanceTable