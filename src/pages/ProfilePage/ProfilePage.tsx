import './ProfilePage.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import MenuMobile from '../../components/MenuMobile/MenuMobile';
import Modal from '../../components/Modal/Modal';
import Container from '../../components/Container/Container';
import EditProfileForm from '../../components/Forms/EditProfileForm';
import AddSportForm from '../../components/Forms/AddSportForm';
import DeleteSportForm from '../../components/Forms/DeleteSportForm';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loader from '../../components/Loader/Loader';
import calculateAgeFromBirthDate from '../../utils/calculateAgeFromBirthDate';
import formatUserName from '../../utils/formatUserName';
import { convertSecondsToHMS } from '../../utils/convertTime';

interface UserInfosProps {
    id: number,
    firstname: string,
    lastname: string,
    birth_date: string,
    gender: string,
    city: string,
    country: string,
    height: number,
    weight: number,
    profile_picture: string,
    is_shared: boolean,
    sessions: UserSessionProps[],
    sports: UserSportsProps[]
}

interface UserSportsProps { 
    id:number,
    name:string,
    unit:string
}

interface ErrorProps {
    status:number,
    message:string
}

interface UserSessionProps {
    id: number,
    score: number,
    sport_id: number,
    user_id: number, 
    date:string
}

const ProfilePage = () => {

    const [userInfos, setUserInfos] = useState<UserInfosProps | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorProps | null>(null);
    //Modal states
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);
    const [isAddSportModalOpen, setIsAddSportModalOpen] = useState<boolean>(false);
    const [isDeleteSportModalOpen, setIsDeleteSportModalOpen] = useState<boolean>(false);
    //Delete sport modal state
    const [selectedSportId, setSelectedSportId] = useState<number | null>(null);

    const navigate = useNavigate(); //Hook to navigate to another page
    const { isAuthenticated, token, userId } = useAuth()!; //Hook to get token and userId from AuthContext if user is authenticated

    //Handle redirection if user is not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/');

        } else {
            getUserProfile();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId])

    //Get user profile infos
    const getUserProfile = async () => { 

        if (!userId) {
            setError({status:401, message:'Unauthorized / Non autorisé'});
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(`https://maxrep-back.onrender.com/api/profile/${userId}` , {
                headers: {
                    'Authorization': `Bearer ${token}` //Send token to backend to verify user
                }
            });
            
            //== Case response is ok
            if (response.status === 200) {
                setUserInfos(response.data);

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
    const handleProfileUpdate = () => {
        getUserProfile();
    };

    //Open and close modals
    const openEditProfileModal = () => { setIsEditProfileModalOpen(true); };
    const closeEditProfileModal = () => { setIsEditProfileModalOpen(false); };
    const openAddSportModal = () => { setIsAddSportModalOpen(true); };
    const closeAddSportModal = () => { setIsAddSportModalOpen(false); };
    const openDeleteSportModal = (sportId: number) => { 
        setSelectedSportId(sportId); //Set selected sport id to delete
        setIsDeleteSportModalOpen(true); 
    };
    const closeDeleteSportModal = () => { setIsDeleteSportModalOpen(false); };

    //Get most recent session score for a sport
    const getMostRecentSessionScore = (userId:number, sportId:number) => {

        if (userInfos) {
            const filteredSessions = userInfos.sessions
            .filter(session => session.user_id === userId && session.sport_id === sportId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sorting by desc date
            

        return filteredSessions.length > 0 ? filteredSessions[0].score : null;


        
        }
    };

    //Handle 3 cases => error, loading and userInfos received
    if (error) {
        return <ErrorPage status={error.status} message={error.message} />
    }

    return (
        <>
            <Header />
            <MenuMobile />
            <div className="profile-page">
                {isLoading ? ( 
                    <Loader isPage /> 
                ) : (
                    userInfos &&  (
                        <>
                            <header className="profile-header">
                                <h2> Profil </h2>
                            </header>
                            <main className="profile-main">
                                <section className="profile__head">
                                    <div className="picture">
                                        <img src={userInfos.profile_picture} alt="profile-picture"/>
                                    </div>
                                    <div className="name">
                                        <h3> {formatUserName(userInfos.firstname)} </h3>
                                        <h3> {formatUserName(userInfos.lastname)} </h3>
                                    </div>
                                </section>
                                <section className="profile__infos">
                                    <Container> 
                                        <div className="container__header">
                                            <h3> Infos </h3>
                                            <i onClick={openEditProfileModal} className="icon fa-solid fa-pen-to-square" title='Editer les infos'></i>
                                        </div>
                                        <div className="container__content">
                                            <div className="info age">
                                                <p> <strong>Age</strong> </p>
                                                <p> {calculateAgeFromBirthDate(userInfos.birth_date)} ans </p>
                                            </div>
                                            <div className="info gender">
                                                <p> <strong>Sexe</strong> </p>
                                                <p> {userInfos.gender} </p>
                                            </div>
                                            <div className="info city">
                                                <p> <strong>Ville</strong> </p>
                                                <p> {userInfos.city ? userInfos.city : "Non renseignée"} </p>
                                            </div>
                                            <div className="info country">
                                                <p> <strong>Pays</strong> </p>
                                                <p> {userInfos.country ? userInfos.country : "Non renseigné"} </p>
                                            </div>
                                            <div className="info height">
                                                <p> <strong>Taille</strong> </p>
                                                <p> {userInfos.height ? userInfos.height + 'cm' : "Non renseigné"} </p>
                                            </div>
                                            <div className="info weight">
                                                <p> <strong>Poids</strong> </p>
                                                <p> {userInfos.weight ? userInfos.weight + 'kg' : "Non renseigné"} </p>
                                            </div>
                                        </div>
                                    </Container>
                                </section>
                                <section className="profile__sports">
                                    <div className="container">
                                        <div className="container__header">
                                            <h3> Sports </h3>
                                            <i onClick={openAddSportModal} className="icon fa-solid fa-circle-plus" title='Ajouter un sport'></i>
                                        </div>
                                        {userInfos.sports.length === 0 ? (
                                            <p style={{textAlign: 'center'}}> Veuillez ajouter un sport ! </p>
                                        ) : (
                                            <table className="sports-table" cellSpacing="10">
                                            <thead>
                                                <tr> 
                                                    <th>  </th>
                                                    <th> Sports suivis </th>
                                                    <th> Dernière perf </th>   
                                                    <th>  </th>   
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userInfos.sports.length > 0 && userInfos.sports.map(sport => (
                                                    <tr key={sport.id}>
                                                        <td> 
                                                            <Link to='/performance'> 
                                                                <i className="icon-table fa-solid fa-chart-line" title='Voir les performances'></i> 
                                                            </Link> 
                                                        </td>
                                                        <td> {sport.name} </td>
                                                        <td>
                                                        {sport.unit === 'kg' ? (
                                                         // Affichage pour les sports en kg
                                                            getMostRecentSessionScore(userInfos.id, sport.id) ?
                                                            (`${getMostRecentSessionScore(userInfos.id, sport.id)} ${sport.unit}`
                                                            ) : ("Aucune donnée")
                                                        ) : (
                                                         // Affichage pour les sports de temps
                                                            getMostRecentSessionScore(userInfos.id, sport.id) ?
                                                            (convertSecondsToHMS(getMostRecentSessionScore(userInfos.id, sport.id) ?? 0))
                                                            : ("Aucune donnée")
                                                        )}
                                                        </td>
                                                        <td> <i onClick={() => openDeleteSportModal(sport.id)} className="icon-table fa-solid fa-circle-xmark" title='Supprimer un sport'></i> </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        )}
                                    </div>
                                </section>
                            </main>
                            <Modal title='Editer mes infos' isOpen={isEditProfileModalOpen} onClose={closeEditProfileModal}> 
                                <EditProfileForm 
                                    userCurrentInfos={userInfos}
                                    onClose={closeEditProfileModal}
                                    onProfileUpdate={handleProfileUpdate}
                                />
                            </Modal>
                            <Modal title='Ajouter un sport' isOpen={isAddSportModalOpen} onClose={closeAddSportModal}> 
                                <AddSportForm
                                    onClose={closeAddSportModal}
                                    onProfileUpdate={handleProfileUpdate}
                                />
                            </Modal>
                            <Modal title='Supprimer le sport' isOpen={isDeleteSportModalOpen} onClose={closeDeleteSportModal}> 
                                <DeleteSportForm
                                    sportId={selectedSportId}
                                    onClose={closeDeleteSportModal}
                                    onProfileUpdate={handleProfileUpdate}
                                />
                            </Modal>                                            
                        </>
                    )
                ) }
            </div>
        </>
    )
}

export default ProfilePage