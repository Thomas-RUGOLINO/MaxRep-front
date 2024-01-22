import './SessionPage.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import AddSessionForm from '../../components/Forms/AddSessionForm';
import EditSessionForm from '../../components/Forms/EditSessionForm';
import Loader from '../../components/Loader/Loader';
import ErrorPage from '../ErrorPage/ErrorPage';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


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
    
    function onChange(nextselectedDate : Date) {
        setSelectedDate(nextselectedDate);
    }

    //! Fonction 1 : formatage de la date au format YYYY-MM-DD à extraire dans un module
    const formatValue = (value: Date) => {
        const dateObject = new Date(value);
        const year = dateObject.getFullYear();
        // Les mois commencent à partir de zéro car ils sont indexés dans un tableau
        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); 
        const day = String(dateObject.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      };
    

     //! Fonction 2 : formatage de la date pour la mettre sour la forme : <nom du jour> <jour> <mois> <année>
    
 
      const formatDateToString = (inputDate: Date) => {
        const dateObject = new Date(inputDate);
      
        // Vérifiez si la date est valide avant de continuer
        if (!isNaN(dateObject.getTime())) {
          const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
          const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      
          const jourSemaine = jours[dateObject.getDay()];
          const jour = dateObject.getDate();
          const moisString = mois[dateObject.getMonth()];
          const annee = dateObject.getFullYear();
      
          return `${jourSemaine} ${jour} ${moisString} ${annee}`;
        } else {
          // Gérer le cas où la date n'est pas valide
          console.error("Date invalide");
          return "";
        }
      };
      
      console.log(userSessions);

    const tileClassName = ({ date }: { date: Date }) => {
        const sessionDate = date.getFullYear() + '-' +
                      String(date.getMonth() + 1).padStart(2, '0') + '-' +
                      String(date.getDate()).padStart(2, '0');
        const isDateInItems = userSessions.some(session => session.date === sessionDate) 
        

        return isDateInItems ? 'session-active' : null;
    }

    const filterSessionsBySelectedDate = () => {
        const formattedSelectedDate = formatValue(selectedDate); // Utilisez votre fonction formatValue pour obtenir la date au format YYYY-MM-DD
        return userSessions.filter(session => session.date === formattedSelectedDate);
    };
    
    const filteredSessions = filterSessionsBySelectedDate();
    
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
                            <Calendar
                                onClickDay={onChange}
                                value={selectedDate}
                                tileClassName={tileClassName}
                        />
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
                                        <h3> {formatDateToString(selectedDate)} </h3>
                                        <i className="fa-solid fa-circle-plus" title='Ajouter une session' onClick={openAddSessionModal}></i>
                                    </div>
                                    <div className="agenda__sessions">
                                    {filteredSessions.length > 0 ? (
                                        filteredSessions.map((session: SessionProps) => (
                                            <div key={session.id} className="session">
                                                <i className="icon fa-solid fa-pen-to-square" title='Editer la session' onClick={() => openEditSessionModal(session)}></i>
                                                <p className='session__title'> <strong>Session de {session.sport.name}</strong> </p>
                                                <p className='session__desc'> {session.description} </p>

                                                {/* Créer un composant spécifique et évolutif en fonction du sport et du score renseigné ou non*/}
                                                <div className="session__score"> 
                                                    <form action="">
                                                        <label htmlFor='score'> Score : </label>
                                                        <p className="score__value"> {session.score} </p>
                                                        {/* <input type='number' name='score' className='score__value' /> */}
                                                        <p className='unit'> kg </p>
                                                        <Button text='Ajouter' color='black' type='submit' isSmall />
                                                    </form>
                                                </div>

                                            </div>
                                        ))
                                        ) : (
                                            <div className="no-sessions">
                                                <p>Aucune session pour cette date.</p>
                                                <Button 
                                                    text='Ajouter une session' 
                                                    color='black' 
                                                    onClick={openAddSessionModal} 
                                                    isSmall
                                                    type='button'
                                                />
                                            </div>
                                        )}
                                        
                                    </div>
                                </div>
                            </section>
                        </main>
                        <Modal title='Ajouter une session' isOpen={isAddSessionModalOpen} onClose={closeAddSessionModal}> 
                            <AddSessionForm 
                                userSports={userSports}
                                date={formatValue(selectedDate)}
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