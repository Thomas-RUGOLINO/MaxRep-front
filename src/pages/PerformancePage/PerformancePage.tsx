import './PerformancePage.scss'
import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import NoPerfMessage from '../../components/NoPerfMessage/NoPerfMessage';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loader from '../../components/Loader/Loader';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { convertSecondsToHMS } from '../../utils/convertTime';
import axios from 'axios';
import { Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    TimeScale, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';

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

interface OpenStatus {
    [key: number]: boolean;
}

const PerformancePage = () => {

    const navigate = useNavigate(); //Hook to navigate to another page
    const { isAuthenticated, token, userId } = useAuth()!; //Hook to get token and userId from AuthContext if user is authenticated

    const [userPerformances, setUserPerformances] = useState<SportProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorProps | null>(null);
    const [isGraphOpen, setIsGraphOpen] = useState<OpenStatus>({});

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
                const initialOpenStatus: OpenStatus = {}
                response.data.sports.forEach((sport: SportProps) => {
                    initialOpenStatus[sport.id] = false;
                })
                setIsGraphOpen(initialOpenStatus);

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

    const toggleOpen = (sportId: number) => {
        setIsGraphOpen((prevStatus: OpenStatus) => ({
            ...prevStatus,
            [sportId]: !prevStatus[sportId]
        }));
    };

    //! Sortir la partie Chart dans un module
    const prepareChartData = (sport: SportProps) => {
        const sortedSessions = sport.sessions.sort((a: SessionProps, b: SessionProps) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const dataPoints = sortedSessions.map(session => ({
            x: new Date(session.date), // Convertir en objet Date
            y: session.score
        }));

        console.log(dataPoints)
    
        return {
            label: '',
            data: dataPoints,
            fill: false,
            borderColor: '#E73725',
            backgroundColor: '#E1E1E1',
        };
    };

    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: 'day' as const,
                    displayFormats: {
                        day: 'd MMM' as const
                    }
                },
                title: {
                    display: true,
                    text: 'Date' as const
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Score (kg)'
                },
            },
        } , 
        plugins: {
            legend: {
                display: false
            },
        },
        
    };

    const chartOptionsTime = {
        responsive: true,
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: 'day' as const,
                    displayFormats: {
                        day: 'd MMM' as const
                    }
                },
                title: {
                    display: true,
                    text: 'Date' as const
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Score (temps)'
                },
                ticks: {
                    callback: function(value: number) {
                        return convertSecondsToHMS(value)
                    }
                }
            },
        }, 
        plugins: {
            legend: {
                display: false
            },
        },
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
                            {userPerformances.length === 0 ? 
                                <NoPerfMessage /> : (
                                <div className="sports-list">
                                    {userPerformances && userPerformances.map((sport: SportProps) => (
                                        <article key={sport.id} className="sport">
                                            <div className="sport__header">
                                                <h3> {sport.name} </h3>
                                                <i className={`fa-solid fa-chevron-${isGraphOpen[sport.id] ? 'up' : 'down'}`} onClick={() => toggleOpen(sport.id)}></i>
                                            </div>
                                            <div className={`sport__content ${isGraphOpen[sport.id] ? '' : 'hide' }`}>
                                                <Line 
                                                    data={{ datasets: [prepareChartData(sport)] }} 
                                                    options={sport.unit === 'temps' ? chartOptionsTime : chartOptions}
                                                />
                                            </div>
                                        </article>
                                    ))}
                            </div>
                            )}
                            
                        </main>
                    </>
                )}
                
            </div>
        </>
    )
}

export default PerformancePage