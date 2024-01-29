import './PerformancePage.scss'
import Header from '../../components/Header/Header';
import MenuMobile from '../../components/MenuMobile/MenuMobile';
import NoPerfMessage from '../../components/NoPerfMessage/NoPerfMessage';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loader from '../../components/Loader/Loader';
import ChartMobile from '../../components/ChartMobile/ChartMobile';
import ChartDesktop from '../../components/ChartDesktop/ChartDesktop';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMediaQuery } from 'react-responsive';
import { convertDateFormatToEu } from '../../utils/formatDate';
import { convertSecondsToHMS } from '../../utils/convertTime';
import Button from '../../components/Button/Button';
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

interface sessionToModifyProps {
    date:string,
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
    const [displaySelectedSport, setDisplaySelectedSport] = useState<SportProps>({id:0, name:'', unit:'', sessions:[]});//[date, score, user_id, sport_id
    const [selectedSportIndex, setSelectedSportIndex] = useState<number>(0); //To know if a sport is clicked to display chart
    const [sessionToModify, setSessionToModify] = useState<sessionToModifyProps>({
        date:'',
        score:0,
        user_id: userId as number,
        sport_id:selectedSport.id});//[date, score, user_id, sport_id

    //Media query to get if device is mobile or desktop
    const isMobile = useMediaQuery({
        query: '(max-width: 992px)'
      }) 

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/');

        } else {
            getUserPerformances();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId]);


    useEffect(() => {
        // Cette fonction sera appelée chaque fois que selectedSport change
        setSessionToModify((prevSessionToModify) => ({
            ...prevSessionToModify,
            sport_id: selectedSport.id,
        }));
    }, [selectedSport]);

    const getUserPerformances = async () => {

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
            
            console.log(response.data);
            
            //== Case response is ok
            if (response.status === 200) {
                setUserPerformances(response.data.sports);
                if (response.data.sports.length > 0) {

                    //Sort by ASC date
                    const sortedSessions = response.data.sports[0].sessions
                            .sort((a: SessionProps, b: SessionProps) => new Date(a.date).getTime() - new Date(b.date).getTime());

                    const sortedSport : SportProps = {
                        ...response.data.sports[0],
                        sessions : sortedSessions
                    };
                    const filteredSessions = sortedSessions.filter((session:SessionProps) => session.score !== 0);

                    const filteredSport : SportProps = {
                        ...response.data.sports[0],
                    sessions : filteredSessions
                    };  

       
        
                    setSelectedSport(sortedSport);
                    setDisplaySelectedSport(filteredSport);
                }

            } else {
                setError({status:500, message:'Internal Server Error / Erreur interne du serveur'})
            }

        } catch (error) {
            setIsLoading(false);
            
            if (axios.isAxiosError(error)) { //== Case if axios error
                if (error.response) {
                    setError({status:error.response.status, message:error.response.data.error});

                } else { //== Case if no response from server
                    setError({status:500, message:'Internal Server Error / Erreur interne du serveur'})
                }

            } else { //== Case if not axios error
                setError({status:500, message:'Internal Server Error / Erreur interne du serveur'})
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

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        console.log(sessionToModify)
        setSessionToModify({
            ...sessionToModify,
            [e.target.name]: e.target.name === 'score' ? parseInt(e.target.value) || 0 : e.target.value
        });
        
    }

    const addScoreOrUpdate = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        console.log(selectedSport);
       /*  const response = await axios.get(`https://maxrep-back.onrender.com/api/sessions/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}` //Send token to backend to verify user
            }
        }); */
        // filter sessions by sport_id and user_id and date
        const filteredResponse = selectedSport.sessions.filter((session:SessionProps) => session.sport_id === selectedSport.id && session.user_id === userId && session.date === sessionToModify.date);
        // if filteredResponse is different null => update session
        if (filteredResponse.length > 0) {
            
            
            const sessionToUpdate = await axios.patch(`https://maxrep-back.onrender.com/api/sessions/${filteredResponse[0].id}`, sessionToModify, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log(sessionToUpdate.data);
            getUserPerformances();
        // else => create session
       
        } else {
            const sessionToCreate = await axios.post(`https://maxrep-back.onrender.com/api/sessions`, sessionToModify, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(sessionToCreate.data);
            getUserPerformances();
        }
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
                                                <article key={sport.id} className={`sport ${index === selectedSportIndex ? 'clicked' : ''}`}  onClick={() => handleSportClick(sport, index)}>
                                                    <div className="sport__header" >
                                                        <h3> {sport.name} </h3>
                                                    </div>
                                                    {index === selectedSportIndex && (
                                                    <div className={`sport__content`}>
                                                        <form action="" onSubmit={addScoreOrUpdate}>
                                                            <label htmlFor="">Date</label>
                                                            <input 
                                                            type="date" 
                                                            name="date" 
                                                            id="" 
                                                            onChange={handleChange}
                                                            required />
                                                            <label htmlFor="">Score</label>
                                                            <input 
                                                            type="text" 
                                                            name="score" 
                                                            id="" 
                                                            onChange={handleChange}
                                                            required/>
                                                            <Button text='Ajouter' color='black' type='submit' isSmall />
                                                        </form>
                                                    </div>)}
                                                </article>
                                            ))}                                            
                                        </div>
                                        <div className="sports-chart">
                                            <ChartDesktop sport={displaySelectedSport} />
                                            <h3 className='table-title'> 5 dernières sessions </h3>
                                            <div className='table'>
                                                <table className='board'>
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