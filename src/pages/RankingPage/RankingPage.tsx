import './RankingPage.scss'
import Header from '../../components/Header/Header';
import MenuMobile from '../../components/MenuMobile/MenuMobile';
import Container from '../../components/Container/Container';
import Button from '../../components/Button/Button';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loader from '../../components/Loader/Loader';
import NoSportMessage from '../../components/NoSportMessage/NoSportMessage';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { countryNames } from '../../data/countriesList';
import {convertSecondsToHMS} from '../../utils/convertTime';
import {convertDateFormatToEu} from '../../utils/formatDate'

interface ErrorProps {
    status:number,
    message:string
}

 interface RankingProps {
    id: number,
    country: string,
    firstname: string,
    lastname: string,
    best_score: number,
    date: string,
    user: UserProps;
    sport: SportProps;
}

interface UserProps {
    city: string | null;
    country: string | null;
    firstname: string;
    lastname: string;
}

interface QueryParamsProps {
    sportId: number,
    gender: string,
    country: string,
    weightMin: number | '',
    weightMax: number | ''
}

interface SportProps {
    id: number,
    name: string,
    unit: string
}

const RankingPage = () => {

    const [error, setError] = useState<ErrorProps | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [ranking, setRanking] = useState<RankingProps[]>([]);
    const [userSports, setUserSports] = useState<SportProps[]>([]);
    const [isShared, setIsShared] = useState<boolean>(false);
    const [queryParams, setQueryParams] = useState<QueryParamsProps>({
        sportId: 4,
        gender: '',
        country: '',
        weightMin: '',
        weightMax: ''
    })
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(20)

    const navigate = useNavigate();
    const { isAuthenticated, token, userId } = useAuth()!;

    const getBestScores =  useCallback (async (queryParams: QueryParamsProps) => {

        try{
            setIsLoading(true);
            setError(null);

            console.log(queryParams)
            if (!queryParams.sportId) {
                return setError({status:401, message:'Unauthorized / Non autorisé'});
            }

            // Récupérer les données de la table ranking en fonction du sport de l'utilisateur
            const response = await axios.get(`https://maxrep-back.onrender.com/api/ranking?sportId=${queryParams.sportId}&gender=${queryParams.gender}&country=${queryParams.country}&weightMin=${queryParams.weightMin}&weightMax=${queryParams.weightMax}` , {
                headers: {
                    'Authorization': `Bearer ${token}` //Send token to backend to verify user
                }
            });

            console.log('bestScores :' , response.data);
            // 1- We check if the sport unit is 'temps' or 'Kg'
            if (response.data[0].sport.unit === 'temps') {
                //If unit is 'temps' we filter the response to remove all best_score = 0
                const FilteredResponse = response.data.filter((item: RankingProps) => item.best_score !== 0);
                //then we sort by ascending order
                const SortedResponse = FilteredResponse.sort((a: RankingProps, b: RankingProps) => a.best_score - b.best_score);
                // we set the state with the sorted response
                setRanking(SortedResponse);

            } else { 
                //If unit is 'Kg' we sort by descending order
                const rank = response.data.sort((a: RankingProps, b: RankingProps) => (a.best_score > b.best_score) ? -1 : 1)
                //We set the state with the sorted response
                setRanking(rank);

            }

            
        }

        catch(error) {
            setIsLoading(false);
            
            if (axios.isAxiosError(error)) { //== Case if axios error
                if (error.response) {
                    setError({status:error.response.status, message:error.response.data.error});

                } else { //== Case if no response from server
                    setError({status:500, message:'Internal Server Error / Erreur interne du serveur (1)'})
                }

            } else { //== Case if not axios error
                setError({status:500, message:'Internal Server Error / Erreur interne du serveur (2)'})
                console.error(error);
            }                 

        } finally {
            setIsLoading(false);
        }
    }, [token]);



    const getUserInfos = async () => {

        if (!userId) {
            setError({status:401, message:'Unauthorized / Non autorisé'});
        }

        try{
            setIsLoading(true);
            setError(null);

            // Récupérer les données de la table ranking en fonction du sport de l'utilisateur
            const response = await axios.get(`https://maxrep-back.onrender.com/api/profile/${userId}` , {
                headers: {
                    'Authorization': `Bearer ${token}` //Send token to backend to verify user
                }
            });

            if (response.data.sports.length === 0) {
                return 
            }
            
            console.log('userInfos :' , response.data);
            setIsShared(response.data.is_shared);
            setUserSports(response.data.sports);
            setQueryParams({
                ...queryParams,
                sportId: response.data.sports[0].id,
                gender: response.data.gender
            })
            getBestScores({
                ...queryParams,
                sportId: response.data.sports[0].id,
                gender: response.data.gender
            })
        }

        catch(error) {
            setIsLoading(false);
            
            if (axios.isAxiosError(error)) { //== Case if axios error
                if (error.response) {
                    setError({status:error.response.status, message:error.response.data.error});

                } else { //== Case if no response from server
                    setError({status:500, message:'Internal Server Error / Erreur interne du serveur (3)'})
                }

            } else { //== Case if not axios error
                setError({status:500, message:'Internal Server Error / Erreur interne du serveur (4)'})
                console.error(error);
            }                 

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/');

        } else {
            getUserInfos();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
    
        setQueryParams(prevParams => ({
            ...prevParams,
            [name]: (name === "sportId" || name === "weightMin" || name === "weightMax") ? parseInt(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (queryParams.weightMin > queryParams.weightMax) {
            //! Afficher un message d'erreur sur le front
            console.log('Erreur !') 
            return setError({status:0, message:'Le poids maximum doit etre supérieur au poids minimum !'}) 
        }

        queryParams.weightMin = queryParams.weightMin === 0 ? '' : queryParams.weightMin;
        queryParams.weightMax = queryParams.weightMax === 0 ? '' : queryParams.weightMax;

        getBestScores(queryParams)
    };
    
    // Find Function to get the SVG corresponding image of the country name
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

    

    if (error) {
        return <ErrorPage status={error.status} message={error.message} />
    }

    return (
        <>
            <Header />
            <MenuMobile />
            <div className="ranking-page">
                {isLoading ? <Loader isPage /> : (
                    <>
                    <header className="ranking-header">
                        <h2> Classements </h2>
                    </header>
                    {userSports.length === 0 ? 
                        <NoSportMessage /> : (
                            <main className='ranking-main'>
                                {isShared === false && (
                                    <div className="ranking-notshared__title">
                                        <p className='ranking-notshared__text'>Vos performances ne sont pas partagées, vous pouvez éditer votre profil et cocher la case</p>
                                        <p className='ranking-notshared__text'><strong>"Partager mes performances"</strong> dans le Profil si vous souhaitez apparaître dans les classements !</p>
                                     </div>
                                )}
                                <Container> 
                                    
                                    <div className="container__header">
                                        <h3> Sélectionner un classement </h3>
                                    </div>
                                    <form action="" onSubmit={handleSubmit}>
                                        <div className="container__fields">
                                            <div className="field">
                                                <label htmlFor="">Sport</label>
                                                <select name="sportId" id="" value={queryParams.sportId} onChange={handleChange}>
                                                    {userSports.map((sport: SportProps) => (
                                                        <option key={sport.id} value={sport.id}> {sport.name} </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="field">
                                                <label htmlFor="">Pays</label>
                                                <select name="country" id="" value={queryParams.country} onChange={handleChange}>
                                                    {Object.entries(countryNames).map(([key, { name }]) => (
                                                        <option key={key} value={name}>{name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="field">
                                                <label htmlFor="">Poids min</label>
                                                <select name='weightMin' value={queryParams.weightMin} onChange={handleChange}>
                                                    <option value=''>Sélectionnez</option>
                                                    {[...Array(301).keys()].map((value) => (
                                                        <option key={value} value={value}>{value}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="field">
                                                <label htmlFor="">Poids max</label>
                                                <select name='weightMax' value={queryParams.weightMax} onChange={handleChange}>
                                                    <option value=''>Sélectionnez</option>
                                                    {[...Array(301).keys()].map((value) => (
                                                        <option key={value} value={value}>{value}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="container__button">
                                            <Button text='Valider' color='black' type='submit' />
                                        </div>
                                    </form>
                                </Container>
                                
                                <table className='board'>
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
                                                <td>{index+1}</td>
                                                <td width= "50px">
                                                {item.user.country && (
                                                    <img src={getCountrySvg(item.user.country) ?? " "} alt={`Drapeau ${item.user.country} `} style={{ width: '30px', height: '20px', borderRadius: '100%' }} />
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
                                                <td>{convertDateFormatToEu(new Date(item.date))}</td>
                                            </tr>
                                        ))) : null}
                                    </tbody>
                                </table>
                                <div className="pagination-controls">
                                    <button onClick={goToPreviousPage} disabled={currentPage === 1}>Précédent</button>
                                    <span>Page {currentPage} sur {totalPages}</span>
                                     <button onClick={goToNextPage} disabled={currentPage === totalPages}>Suivant</button>
                                </div>
                            </main>
                        )}
                    
                    </>
                )}
            </div>
        </>
    )
}

export default RankingPage