import './SessionPage.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDateInLetters } from '../../utils/formatDate';
import axios from 'axios';
import Header from '../../components/Header/Header';
import MenuMobile from '../../components/MenuMobile/MenuMobile';
import Modal from '../../components/Modal/Modal';
import AddSessionForm from '../../components/Forms/AddSessionForm';
import EditSessionForm from '../../components/Forms/EditSessionForm';
import Loader from '../../components/Loader/Loader';
import ErrorPage from '../ErrorPage/ErrorPage';
import Calendar from 'react-calendar';
import NoSportMessage from '../../components/NoSportMessage/NoSportMessage';
import 'react-calendar/dist/Calendar.css';
import Agenda from '../../components/Agenda/Agenda';

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
    const [userSessions, setUserSessions] = useState<SessionProps[]>([]); 
    const [userSports, setUserSports] = useState([]);
    // State qui stocke la valeur cliquée dans le calendrier
    const [selectedDate, setSelectedDate] = useState(new Date()); 
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
            navigate('/');

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
            setIsLoading(false);
        }
    }

    //Refresh user profile infos after update
    const handleSessionsUpdate = () => {
        getUserSessions();
    };
    
    function onChange(nextselectedDate : Date) {
        setSelectedDate(nextselectedDate);
    }    

    //! Sortir le calendrier dans un composant ?
    //Handle calendar tile color depending on userSessions
    const tileClassName = ({ date }: { date: Date }) => {
        const sessionDate = date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2, '0');
        const isDateInItems = userSessions.some(session => session.date === sessionDate) 
        
        return isDateInItems ? 'session-active' : null;
    }

    const filterSessionsBySelectedDate = () => {
        const formattedSelectedDate = formatDateInLetters(selectedDate); // get date in format 'YYYY-MM-DD'
        return userSessions.filter(session => session.date === formattedSelectedDate);
    };
    
    const filteredSessions = filterSessionsBySelectedDate();

    //Handle 3 cases => error, loading and userInfos received
    if (error) {
        return <ErrorPage status={error.status} message={error.message} />
    }
    
    return (
        <>
            <Header />
            <MenuMobile />
            <div className="session-page">
                {isLoading ? (
                <Loader isPage />
                ) : (
                    <>
                    <header className="session-header">
                        <h2> Sessions </h2>
                    </header>
                    {userSports.length === 0 ?
                        <NoSportMessage /> : (
                            <>
                            <main>
                                <section className='calendar-container'> 
                                <Calendar
                                    onClickDay={onChange}
                                    value={selectedDate}
                                    tileClassName={tileClassName}
                                />
                                </section>
                                <section className="agenda-container">
                                    <Agenda 
                                        selectedDate={selectedDate} 
                                        filteredSessions={filteredSessions}
                                        onOpenAddSessionModal={openAddSessionModal} 
                                        onOpenEditSessionModal={openEditSessionModal}
                                        onProfileUpdate={handleSessionsUpdate}
                                    />
                                </section>
                            </main>
                            <Modal title='Ajouter une session' isOpen={isAddSessionModalOpen} onClose={closeAddSessionModal}> 
                                <AddSessionForm 
                                    userSports={userSports}
                                    date={formatDateInLetters(selectedDate)}
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
                    </>
                )}
                
            </div>
        </>
    )
}

export default SessionPage