import './SessionPage.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import SessionScore from '../../components/SessionScore/SessionScore';
import Modal from '../../components/Modal/Modal';
import AddSessionForm from '../../components/Forms/AddSessionForm';
import EditSessionForm from '../../components/Forms/EditSessionForm';
import Loader from '../../components/Loader/Loader';
import ErrorPage from '../ErrorPage/ErrorPage';

//Route back => GET /sessions/:userId & POST /sessions

interface SessionProps {
    id:number,
    description:string,
    score:number,
    date:string,
    sport_id:number,
    sport:{
        name:string,
        unit:string
    }
 }

interface ErrorProps {
    status:number,
    message:string
}

const SessionPage = () => {

    const [userSessions, setUserSessions] = useState([]); 
    const [userSports, setUserSports] = useState([]);
    const [selectedDate, setSelectedDate] = useState<string>('2024-01-15'); 
    const [selectedSession, setSelectedSession] = useState<SessionProps | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorProps | null>(null);
    //Handle modals
    const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState<boolean>(false);
    const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState<boolean>(false);

    const navigate = useNavigate(); //Hook to navigate to another page
    const { isAuthenticated, token, userId } = useAuth()!; //Hook to get token and userId from AuthContext if user is authenticated

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');

        } else {
            getUserSessions();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId]);

    const openAddSessionModal = () => { setIsAddSessionModalOpen(true) };
    const closeAddSessionModal = () => { setIsAddSessionModalOpen(false) };
    const openEditSessionModal = (session: SessionProps) => { 
        setSelectedSession(session);
        setIsEditSessionModalOpen(true);
    };
    const closeEditSessionModal = () => { setIsEditSessionModalOpen(false) };

    const getUserSessions = async () => {

        if (!userId) {
            setError({status:401, message:'Unauthorized / Non autorisé'});
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(`https://maxrep-back.onrender.com/api/sessions/${userId}` , {
                headers: {
                    'Authorization': `Bearer ${token}` //Send token to backend to verify user
                }
            });
            
            console.log(response.data);
            
            //== Case response is ok
            if (response.status === 200) {
                setUserSessions(response.data.sessions);
                setUserSports(response.data.sports);

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

    //Refresh user profile infos after update
    const handleSessionsUpdate = () => {
        getUserSessions();
    };

    //Handle 3 cases => error, loading and userInfos received
    if (error) {
        return <ErrorPage status={error.status} message={error.message} />
    }

    return (
        <>
            <Header />
            <NavMenu />
            <div className="session-page">
                {isLoading ? (
                <Loader isPage />
                ) : (
                    <>
                        <header className="session-header">
                        <h2> Sessions </h2>
                        </header>
                        <main>
                            <section className='calendar-container'> 
                                Calendrier à ajouter 
                            </section>
                            <section className="agenda-container">
                                <div className="agenda">
                                    <div className="agenda__spirals">
                                        <span className="spiral"></span>
                                        <span className="spiral"></span>
                                        <span className="spiral"></span>
                                        <span className="spiral"></span>
                                        <span className="spiral"></span>
                                        <span className="spiral"></span>
                                        <span className="spiral"></span>
                                        <span className="spiral"></span>
                                    </div>
                                    <div className="agenda__header">
                                        <h3> Jeudi 15 janvier 2024 </h3>
                                        <i className="fa-solid fa-circle-plus" title='Ajouter une session' onClick={openAddSessionModal}></i>
                                    </div>
                                    <div className="agenda__sessions">
                                        {userSessions.map((session: SessionProps) => (
                                            <div key={session.id} className="session">
                                                <i className="icon fa-solid fa-pen-to-square" title='Editer la session' onClick={() => openEditSessionModal(session)}></i>
                                                <p className='session__title'> <strong>Session de {session.sport.name}</strong> </p>
                                                <p className='session__desc'> {session.description} </p>
                                                <SessionScore 
                                                    session={session} 
                                                    isScore={parseInt(session.score.toString()) === 0 ? false : true}
                                                    onProfileUpdate={handleSessionsUpdate}    
                                                />
                                            </div>
                                        ) )}
                                        
                                    </div>
                                </div>
                            </section>
                        </main>
                        <Modal title='Ajouter une session' isOpen={isAddSessionModalOpen} onClose={closeAddSessionModal}> 
                            <AddSessionForm 
                                userSports={userSports}
                                date={selectedDate}
                                onClose={closeAddSessionModal}
                                onProfileUpdate={handleSessionsUpdate}
                            />
                        </Modal>
                        <Modal title='Editer une session' isOpen={isEditSessionModalOpen} onClose={closeEditSessionModal}> 
                            {selectedSession && (
                                <EditSessionForm 
                                    session={selectedSession}
                                    userSports={userSports}
                                    onClose={closeEditSessionModal}
                                    onProfileUpdate={handleSessionsUpdate}
                                />
                            )}
                        </Modal>
                    </>
                )}
                
            </div>
        </>
    )
}

export default SessionPage