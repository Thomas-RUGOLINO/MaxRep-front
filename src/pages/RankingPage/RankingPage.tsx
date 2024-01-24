import './RankingPage.scss'
import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
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
    date: string
    user: UserProps;
}

interface UserProps {
    city: string | null;
    country: string | null;
    firstname: string;
    lastname: string;
    // autres champs...
}

const RankingPage = () => {

    const [error, setError] = useState<ErrorProps | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userSportID, setUserSportID] = useState<number>(1);
    const [userGender, setUserGender] = useState<string>('');
    const [ranking, setRanking] = useState<RankingProps[]>([]);
    const [userSports, setUserSports] = useState<[]>([]); // Liste des sports de l'utilisateur

    const navigate = useNavigate();
    const { isAuthenticated, token, userId } = useAuth()!;

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');

        } else {
            getUserInfos();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId]);

    useEffect(() => {
        console.log(userSportID);
        console.log(userGender);
    }, [userSportID, userGender])

    useEffect(() => {
        if (userSportID) {
            getBestScores(userSportID, userGender); // Exécutez getRanking si sportId est défini
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userSportID, userGender]);

    // récupérer les infos de l'utilisateur
    const getUserInfos = async () => {
            
            if (!userId) {
                setError({status:401, message:'Unauthorized / Non autorisé'});
            }
    
            try{
                setIsLoading(true);
                setError(null);
    
                // récupérer les infos de l'utilisateur
                const response = await axios.get(`https://maxrep-back.onrender.com/api/profile/${userId}` , {
                    headers: {
                        'Authorization': `Bearer ${token}` //Send token to backend to verify user
                    }
                });
                
                setUserSportID(response.data.sports[0].id);
                setUserGender(response.data.gender)
                setUserSports(response.data.sports);

            }
    
            catch(error) {
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

    const getBestScores = async (userSportID: number, userGender: string) => {

        if (!userId) {
            setError({status:401, message:'Unauthorized / Non autorisé'});
        }

        try{
            setIsLoading(true);
            setError(null);

            console.log("userSportID : " , userSportID);
            console.log("userGender: ", userGender);

            // récupérer les données de la table ranking en fonction du sport de l'utilisateur
            const response = await axios.get(`https://maxrep-back.onrender.com/api/ranking?sportId=${userSportID}&gender=${userGender}` , {
                headers: {
                    'Authorization': `Bearer ${token}` //Send token to backend to verify user
                }
            });
            
            setRanking(response.data);
            console.log('ranking :' , response.data);
        }

        catch(error) {
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
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUserSportID(parseInt(e.target.value));
    }

    

    return (
        <>
            <Header />
            <NavMenu />
            <div className="ranking-page">

                <header className="ranking-header">
                    <h1> RankingPage </h1>
                </header>
                
                <main className='ranking-main'>
                    <form action="">
                        <select name="sportId" id="" onChange={handleChange}>
                            {userSports.length > 0 ? (userSports.map((item: any, index) => (
                                <option key={index} value={item.id}>{item.name}</option>
                            ))) : null}
                        </select>
                        <select name="country" id="">
                            {Object.entries(countryNames).map(([key, value]) => (
                                <option key={key} value={value}>{value}</option>
                            ))}
                        </select>
                    </form>

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
                            ranking.map((item: RankingProps, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item.user.country}</td>
                                    <td>{item.user.firstname} {item.user.lastname}</td>
                                    <td>{item.best_score}</td>
                                    <td>{item.date}</td>
                                </tr>
                            ))) : null}
                        </tbody>
                    </table>
                </main>

                
            </div>
            
        </>
    )
}

export default RankingPage