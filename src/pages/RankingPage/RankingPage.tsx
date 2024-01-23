import './RankingPage.scss'
import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ErrorProps {
    status:number,
    message:string
}

const RankingPage = () => {

    const [error, setError] = useState<ErrorProps | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { isAuthenticated, token, userId } = useAuth()!;

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');

        } else {
            getBestScores();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId]);

    const getBestScores = async () => {

        if (!userId) {
            setError({status:401, message:'Unauthorized / Non autorisé'});
        }

        try{
            setIsLoading(true);
            setError(null);

            const response = await axios.get(`https://maxrep-back.onrender.com/api/ranking?sportId=3` , {
                headers: {
                    'Authorization': `Bearer ${token}` //Send token to backend to verify user
                }
            });

            console.log(response);
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
                        <select name="sportId" id="">
                            <option value="">Back Squat</option>
                            <option value="">Marathon</option>
                            <option value="">100m Papillon</option>
                            <option value="">Snatch</option>
                        </select>
                        <select name="country" id="">
                            <option value="">France</option>
                            <option value="">Allemagne</option>
                            <option value="">Canada</option>
                            <option value="">Brésil</option>
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
                            <tr>
                                <td>1</td>
                                <td>France</td>
                                <td>Michel Ricard</td>
                                <td>100</td>
                                <td>22/01/2024</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Japon</td>
                                <td>Professeur Onizuka</td>
                                <td>150</td>
                                <td>15/01/2024</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>France</td>
                                <td>John Doe</td>
                                <td>80</td>
                                <td>20/01/2024</td>
                            </tr>
                        </tbody>
                    </table>
                </main>

                
            </div>
            
        </>
    )
}

export default RankingPage