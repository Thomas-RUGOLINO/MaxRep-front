import './PerformancePage.scss'
import Header from '../../components/Header/Header';
import MenuMobile from '../../components/MenuMobile/MenuMobile';
import NoPerfMessage from '../../components/NoPerfMessage/NoPerfMessage';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loader from '../../components/Loader/Loader';
import Chart from '../../components/Chart/Chart';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
    sport_id:number,
}

const PerformancePage = () => {

    const navigate = useNavigate(); //Hook to navigate to another page
    const { isAuthenticated, token, userId } = useAuth()!; //Hook to get token and userId from AuthContext if user is authenticated

    const [userPerformances, setUserPerformances] = useState<SportProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorProps | null>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/');

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
            setIsLoading(false);
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
                        <main>
                            {userPerformances.length === 0 ? 
                                <NoPerfMessage /> : (
                                <div className="sports-list">
                                    {userPerformances && userPerformances.map((sport: SportProps) => (
                                        <Chart sport={sport} />
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