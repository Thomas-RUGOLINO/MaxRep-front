import './RankingPage.scss'
import Header from '../../components/Header/Header';
import MenuMobile from '../../components/MenuMobile/MenuMobile';
import Container from '../../components/Container/Container';
import RankingTable from '../../components/RankingTable/RankingTable';
import Button from '../../components/Button/Button';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loader from '../../components/Loader/Loader';
import NoSportMessage from '../../components/NoSportMessage/NoSportMessage';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { countryNames } from '../../data/countriesList';


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

    const [error, setError] = useState<ErrorProps | null>(null); //To display error page if error with request
    const [errorMessage, setErrorMessage] = useState<string>(''); //To display error message on front
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


    const navigate = useNavigate();
    const { isAuthenticated, token, userId } = useAuth()!;

    const getBestScores =  useCallback (async (queryParams: QueryParamsProps) => {

        try{
            setIsLoading(true);
            setError(null);

            if (!queryParams.sportId) {
                return setError({status:401, message:'Unauthorized / Non autorisé'}); //!Message
            }

            // Récupérer les données de la table ranking en fonction du sport de l'utilisateur
            const response = await axios.get(`https://maxrep-back.onrender.com/api/ranking?sportId=${queryParams.sportId}&gender=${queryParams.gender}&country=${queryParams.country}&weightMin=${queryParams.weightMin}&weightMax=${queryParams.weightMax}` , {
                headers: {
                    'Authorization': `Bearer ${token}` //Send token to backend to verify user
                }
            });

            //== Case response is not ok
            if (response.status !== 200) {
                setError({status:response.status, message:response.data.error})
            }

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
                    setError({status:500, message:'Erreur interne du serveur.'})
                }

            } else { //== Case if not axios error
                setError({status:500, message:'Une erreur inattendue est survenue.'})
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

             //== Case response is not ok
             if (response.status !== 200) {
                setError({status:response.status, message:response.data.error})
            }

            if (response.data.sports.length === 0) {
                return 
            }
            
            // Set the state with the response data
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
            return setErrorMessage('Le poids minimum doit être inférieur au poids maximum !');
        }

        queryParams.weightMin = queryParams.weightMin === 0 ? '' : queryParams.weightMin;
        queryParams.weightMax = queryParams.weightMax === 0 ? '' : queryParams.weightMax;

        getBestScores(queryParams)
    };

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
                                    <div className="container__errors">
                                        {errorMessage && <p className='error-message'>{errorMessage}</p>}
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
                                <RankingTable ranking={ranking} />
                            </main>
                        )}
                    
                    </>
                )}
            </div>
        </>
    )
}

export default RankingPage