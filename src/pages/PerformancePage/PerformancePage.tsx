import './PerformancePage.scss'
import Header from '../../components/Header/Header';
import MenuMobile from '../../components/MenuMobile/MenuMobile';
import NoPerfMessage from '../../components/NoPerfMessage/NoPerfMessage';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loader from '../../components/Loader/Loader';
import ChartMobile from '../../components/ChartMobile/ChartMobile';
import ChartDesktop from '../../components/ChartDesktop/ChartDesktop';
import PerformanceScore from '../../components/PerformanceScore/PerformanceScore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMediaQuery } from 'react-responsive';
import { convertDateFormatToEu } from '../../utils/formatDate';
import { convertSecondsToHMS } from '../../utils/convertTime';
import axios from 'axios';

interface ErrorProps {
    status:number,
    message:string
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

const PerformancePage = () => {

    const navigate = useNavigate(); //Hook to navigate to another page
    const { isAuthenticated, token, userId } = useAuth()!; //Hook to get token and userId from AuthContext if user is authenticated

    const [userPerformances, setUserPerformances] = useState<SportProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorProps | null>(null);
    const [selectedSport, setSelectedSport] = useState<SportProps>({id:0, name:'', unit:'', sessions:[]}); 
    const [displaySelectedSport, setDisplaySelectedSport] = useState<SportProps>({id:0, name:'', unit:'', sessions:[]});//[date, score, user_id, sport_id // use to show only sessions where score is not 0
    const [selectedSportIndex, setSelectedSportIndex] = useState<number>(0); //To know if a sport is clicked to display chart

    //Media query to get if device is mobile or desktop
    const isMobile = useMediaQuery({
        query: '(max-width: 992px)'
      }) 

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/');

        } else {
            getUserPerformances(0); //Init display first sport
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId]);

    const getUserPerformances = async (sportIndex: number) => {

        if (!userId) {
            setError({status:401, message:'Unauthorized / Non autorisé'});
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(`https://maxrep-back.onrender.com/api/performances/${userId}` , {
                headers: {
                    'Authorization': `Bearer ${token}` //Send token to backend to verify user
                }
            });
            console.log(response.data)
            //== Case response is not ok
            if (response.status !== 200) {
                setError({status:response.status, message:response.data.error})
            }
            
            //== Case response is ok
                console.log(response.data.sports);
                setUserPerformances(response.data.sports);
                if (response.data.sports.length > 0) {

                    //Sort by ASC date
                    const sortedSessions = response.data.sports[sportIndex].sessions
                            .sort((a: SessionProps, b: SessionProps) => new Date(a.date).getTime() - new Date(b.date).getTime());

                    const sortedSport : SportProps = {
                        ...response.data.sports[sportIndex],
                        sessions : sortedSessions
                    };
                    const filteredSessions = sortedSessions.filter((session:SessionProps) => session.score !== 0);

                    const filteredSport : SportProps = {
                        ...response.data.sports[sportIndex],
                    sessions : filteredSessions
                    };  

                    setSelectedSport(sortedSport);
                    setDisplaySelectedSport(filteredSport);
            }

        } catch (error) {
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
    }

    const handleSportClick = (sport:SportProps, index: number) => { 

        //Sort by ASC date
        const sortedSessions = sport.sessions
                .sort((a: SessionProps, b: SessionProps) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        //Filter sortedSessions to get only session where score is not 0
      

        const sortedSport : SportProps = {
            ...sport,
            sessions : sortedSessions
        };  

        const filteredSessions = sortedSessions.filter((session:SessionProps) => session.score !== 0);

        const filteredSport : SportProps = {
            ...sport,
            sessions : filteredSessions
        };  

        setSelectedSport(sortedSport);
        setDisplaySelectedSport(filteredSport);
        setSelectedSportIndex(index);
    }

    //Handle 3 cases => error, loading and userInfos received
    if (error) {
        return <ErrorPage status={error.status} message={error.message} />
    }

    return (
        <>
            <Header />
            <MenuMobile />
            <div className="performance-page">
                {isLoading && <Loader /> ? (
                    <Loader isPage />
                ) : (
                    <>
                        <header className="performance-header">
                            <h2> Performance </h2>
                        </header>
                        {isMobile ? (
                            <main className='main-mobile'>
                                {userPerformances.length === 0 ? 
                                    <NoPerfMessage /> : (
                                    <div className="sports-list">
                                        {userPerformances && userPerformances.map((sport: SportProps) => (                                           
                                            <ChartMobile key={sport.id} sport={sport} />
                                        ))}
                                    </div>
                                )}  
                            </main>
                        ) : (
                            <main className='main-desktop'>
                                {userPerformances.length === 0 ? 
                                    <NoPerfMessage /> : (
                                    <>
                                        <div className="sports-list">
                                            {userPerformances && userPerformances.map((sport: SportProps, index) => (
                                                <article 
                                                    key={sport.id} 
                                                    className={`sport ${index === selectedSportIndex ? 'clicked' : ''}`}  
                                                    onClick={() => handleSportClick(sport, index)}
                                                >
                                                    <div className="sport__header" >
                                                        <h3> {sport.name} </h3>
                                                    </div>
                                                    {index === selectedSportIndex && (
                                                    <div className={`sport__content`}>
                                                        <PerformanceScore 
                                                            selectedSport={selectedSport} 
                                                            sportIndex={index} 
                                                            getUserPerformances={getUserPerformances} 
                                                        />
                                                    </div>)}
                                                </article>
                                            ))}                                            
                                        </div>
                                        <div className="sports-chart">
                                            <ChartDesktop sport={displaySelectedSport} />
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
                                        </div>
                                    </>
                                )} 
                            </main>
                        )}
                        
                    </>
                )}
                
            </div>
        </>
    )
}

export default PerformancePage