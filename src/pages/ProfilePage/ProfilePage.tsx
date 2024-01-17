import './ProfilePage.scss';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import Modal from '../../components/Modal/Modal';
import EditProfileForm from '../../components/Forms/EditProfileForm';
import AddSportForm from '../../components/Forms/AddSportForm';
import DeleteSportForm from '../../components/Forms/DeleteSportForm';
import ErrorPage from '../ErrorPage/ErrorPage';
import calculateAgeFromBirthDate from '../../utils/calculateAgeFromBirthDate';
import formatUserName from '../../utils/formatUserName';

interface DecodedTokenProps {
    id: number; 
    firstname: string;
    lastname: string;
}

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
    //! Add a loader state
    const [error, setError] = useState<ErrorProps | null>(null);
    //Modal states
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);
    const [isAddSportModalOpen, setIsAddSportModalOpen] = useState<boolean>(false);
    const [isDeleteSportModalOpen, setIsDeleteSportModalOpen] = useState<boolean>(false);
    //Delete sport modal state
    const [selectedSportId, setSelectedSportId] = useState<number | null>(null);

    //Get user profile infos
    const getUserProfile = async () => {  //! ==> Déplacer cette fonction dans le dossier services

        const token = localStorage.getItem('userToken');

        //Testing if token exists
        if (token) {
            const decodedTokenProps: DecodedTokenProps = jwtDecode<DecodedTokenProps>(token);
            const userId = decodedTokenProps.id;

            try {
                const response = await axios.get(`https://maxrep-back.onrender.com/api/profile/${userId}` , {
                    headers: {
                        'Authorization': `Bearer ${token}` //Send token to backend to verify user
                    }
                });
                //! Add a loader 
                console.log(response.data);
                
                //== Case response is ok
                if (response.status === 200) {
                    setUserInfos(response.data);
                } 

            } catch (error) {
                if (axios.isAxiosError(error)) { //== Case if axios error
                    if (error.response) {
                        setError({status:error.response.status, message:error.response.data.error});
    
                    } else { //== Case if no response from server
                        setError({status:500, message:'Internal Server Error / Erreur interne du serveur'})
                    }
    
                } else { //== Case if not axios error
                    setError({status:500, message:'Internal Server Error / Erreur interne du serveur'})
                }
                console.log(error);
            }

        //If there is no token
        } else {
            setError({status:401, message:'Unauthorized / Non autorisé'});
        }

        
    }

    const handleProfileUpdate = () => {
        // Appelle getUserProfile pour recharger les informations
        getUserProfile();
    };

    //Handle modals
    const openEditProfileModal = () => { setIsEditProfileModalOpen(true); };
    const closeEditProfileModal = () => { setIsEditProfileModalOpen(false); };
    const openAddSportModal = () => { setIsAddSportModalOpen(true); };
    const closeAddSportModal = () => { setIsAddSportModalOpen(false); };
    const openDeleteSportModal = (sportId: number) => { 
        setSelectedSportId(sportId); //Set selected sport id to delete
        setIsDeleteSportModalOpen(true); 
    };
    const closeDeleteSportModal = () => { setIsDeleteSportModalOpen(false); };

    const getMostRecentSessionDate = (userId:number, sportId:number) => {

        if (userInfos) {
            const filteredSessions = userInfos.sessions
            .filter(session => session.user_id === userId && session.sport_id === sportId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sorting by desc date

        console.log(filteredSessions);
        return filteredSessions.length > 0 ? filteredSessions[0].score : null;
        }
    };

    useEffect(() => {
        getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    //Handle 3 cases => error, loading and userInfos received
    return (
        <> 
        {error && <ErrorPage status={error.status} message={error.message} />}
        {!error && userInfos && (
            <>
                <Header />
                <NavMenu />
                <div className='profile-page'>
                    <header className="profile-header">
                        <h2> Profil </h2>
                    </header>
                    <main className="profile-main">
                        <section className="profile__head">
                            <div className="picture">
                                <img src="/assets/test/profile-picture-test.jpg" alt="profile-picture"/>
                            </div>
                            <div className="name">
                                <h3> {formatUserName(userInfos.firstname)} </h3>
                                <h3> {formatUserName(userInfos.lastname)} </h3>
                            </div>
                        </section>
                        <section className="profile__infos">
                            <div className="container">
                                <div className="container__header">
                                    <h3> Infos </h3>
                                    <i onClick={openEditProfileModal} className="icon fa-solid fa-pen-to-square"></i>
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
                            </div>
                        </section>
                        <section className="profile__sports">
                            <div className="container">
                                <div className="container__header">
                                    <h3> Sports </h3>
                                    <i onClick={openAddSportModal} className="icon fa-regular fa-square-plus"></i>
                                </div>
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
                                                <td> <i className="icon-table fa-solid fa-chart-line"></i> </td>
                                                <td> {sport.name} </td>
                                                <td>
                                                     {getMostRecentSessionDate(userInfos.id, sport.id) ? 
                                                    (`${getMostRecentSessionDate(userInfos.id, sport.id)} ${sport.unit}`
                                                    ) : ("Aucune donnée")}
                                                </td>
                                                <td> <i onClick={() => openDeleteSportModal(sport.id)} className="icon-table fa-solid fa-circle-xmark"></i> </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </main>
                </div>

                {/* Modals are displayed on user's clicks */}
                <Modal title='Editer mes infos' isOpen={isEditProfileModalOpen} onClose={closeEditProfileModal}> 
                    <EditProfileForm 
                        userId={userInfos.id}
                        userCurrentInfos={userInfos}
                        onClose={closeEditProfileModal}
                        onProfileUpdate={handleProfileUpdate}
                    />
                </Modal>
                <Modal title='Ajouter un sport' isOpen={isAddSportModalOpen} onClose={closeAddSportModal}> 
                    <AddSportForm
                        userId={userInfos.id}
                        onClose={closeAddSportModal}
                    />
                </Modal>
                <Modal title='Supprimer le sport' isOpen={isDeleteSportModalOpen} onClose={closeDeleteSportModal}> 
                    <DeleteSportForm
                        userId={userInfos.id}
                        sportId={selectedSportId}
                        onClose={closeDeleteSportModal}
                    />
                </Modal>
            </>
            )}
        
        </>
    )
}

export default ProfilePage