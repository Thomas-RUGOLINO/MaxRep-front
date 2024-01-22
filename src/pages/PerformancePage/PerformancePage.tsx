import './PerformancePage.scss'
import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loader from '../../components/Loader/Loader';
// import { LinearScaleOptions, TimeScaleOptions } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend
  );

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
    sport_id:number,
}

const PerformancePage = () => {

    const navigate = useNavigate(); //Hook to navigate to another page
    const { isAuthenticated, token, userId } = useAuth()!; //Hook to get token and userId from AuthContext if user is authenticated

    const [userPerformances, setUserPerformances] = useState<SportProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorProps | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');

        } else {
            getUserPerformances();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId]);

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
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }

    const toggleOpen = () => { 
        setIsOpen(!isOpen);
    }


    //! Sortir la partie Chart dans un module

    const prepareChartData = (sport: SportProps) => {
        const sortedSessions = sport.sessions.sort((a: SessionProps, b: SessionProps) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const dataPoints = sortedSessions.map(session => ({
            x: new Date(session.date), // Convertir en objet Date
            y: session.score
        }));
    
        return {
            label: sport.name,
            data: dataPoints,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
        };
    };

    const chartOptions = {
    scales: {
        x: {
            type: 'time' as const,
            time: {
                unit: 'day',
                displayFormats: {
                    day: 'MMM d'
                }
            },
            title: {
                display: true,
                text: 'Date'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Score'
            }
        }
    },
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const, // Utiliser 'as const' pour un typage plus strict
        },
        title: {
            display: true,
            text: 'User Performance'
        }
    }
};

    //Handle 3 cases => error, loading and userInfos received
    if (error) {
        return <ErrorPage status={error.status} message={error.message} />
    }

    return (
        <>
            <Header />
            <NavMenu />
            <div className="performance-page">
                {isLoading && <Loader /> ? (
                    <Loader isPage />
                ) : (
                    <>
                        <header className="performance-header">
                            <h2> Performance </h2>
                        </header>
                        <main>
                            <div className="sports-list">
                                {userPerformances && userPerformances.map((sport: SportProps) => (
                                    <article key={sport.id} className="sport">
                                        <div className="sport__header">
                                            <h3> {sport.name} </h3>
                                            <i className="fa-solid fa-chevron-down" onClick={toggleOpen}></i>
                                        </div>
                                        <div className={`sport__content`}>
                                            <Line 
                                                data={{ datasets: [prepareChartData(sport)] }} 
                                                options={chartOptions} 
                                            />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </main>
                    </>
                )}
                
            </div>
        </>
    )
}

export default PerformancePage