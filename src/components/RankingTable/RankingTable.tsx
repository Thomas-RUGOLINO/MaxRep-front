import './RankingTable.scss';
import { useState } from 'react';
import {convertSecondsToHMS} from '../../utils/convertTime';
import {convertDateFormatToEu} from '../../utils/formatDate';
import { countryNames } from '../../data/countriesList';

interface RankingTableProps { 
    ranking: RankingProps[];
}

interface RankingProps { 
    id: number,
    country: string,
    firstname: string,
    lastname: string,
    best_score: number,
    date: Date,
    user: UserProps
    sport: SportProps
}

interface UserProps {
    city: string | null;
    country: string | null;
    firstname: string;
    lastname: string;
}

interface SportProps {
    id: number,
    name: string,
    unit: string
}

const RankingTable = ({ranking}: RankingTableProps) => { 

    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const [rowsPerPage] = useState(20) // Pagination

    // Get the SVG corresponding image of the country name
    const getCountrySvg = (countryName : string) => {
        const country = Object.values(countryNames).find(country => country.name === countryName);
        return country ? country.svg : null;
    }

    // Pagination
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = ranking.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(ranking.length / rowsPerPage);

    const goToNextPage = () => setCurrentPage(page => Math.min(page + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage(page => Math.max(page - 1, 1));

    return (
        <>
            <div className='board'>
                <table className='board-table'>
                    <thead>
                        <tr>
                            <th>Rang</th>
                            <th>Pays</th>
                            <th>Nom Prénom</th>
                            <th>Best Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {ranking.length > 0 ? (
                        currentItems.map((item: RankingProps, index) => (
                            <tr key={index}>
                                <td width= "50px">{index+1}</td>
                                <td width= "50px">
                                {item.user.country && (
                                    <img 
                                        src={getCountrySvg(item.user.country) ?? " "} 
                                        alt={`Drapeau ${item.user.country} `} 
                                        style={{ width: '30px', height: '20px', borderRadius: '100%' }} 
                                    />
                                )}
                                </td>
                                <td>{item.user.firstname} {item.user.lastname}</td>
                                <td>
                                    {item.sport.unit === 'temps' ? (
                                    convertSecondsToHMS(item.best_score)
                                    ) : (
                                        item.best_score + ' kg'
                                    )}
                                </td>
                                <td>{convertDateFormatToEu(item.date)}</td>
                            </tr>
                        ))) : (
                            <tr > 
                                <td className='empty-table-message' colSpan={5}> Pas d'athlètes à classer avec ce filtre !  </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="pagination-controls">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1}>Précédent</button>
                    <span>Page {currentPage} sur {totalPages}</span>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages}>Suivant</button>
                </div>
            </div>
        </>
    )
}

export default RankingTable;