import './ProfilePage.scss';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

interface DecodedToken {
    id: number; 
    firstname: string;
    lastname: string;
}

const ProfilePage = () => {

    const [userInfos, setUserInfos] = useState({});

    const getUserProfile = async () => {

        const token = localStorage.getItem('userToken');

        //Testing if token exists
        if (token) {
            const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
            const userId = decodedToken.id;

            try {
                const response = await axios.get(`https://maxrep-back.onrender.com/api/profile/${userId}` , {
                    headers: {
                        'Authorization': `Bearer ${token}` //Send token to backend to verify user
                    }
                });
                console.log(response);

                //== Case response is forbidden 
                if (response.status === 403) {
                    //! Afficher page erreur 403
                }
                
                //== Case response is ok
                if (response.status === 200) {
                    //! Traitement de la data et maj du state
                } 

            } catch (error) {
                console.error(error);
                //! Affiche page erreur 500 'Erreur serveur'
            }

        } else {
            //! Si pas de token envoyer sur une page d'erreur
            console.log('No token');
        }
    }

    useEffect(() => {
        getUserProfile();
    },[]);

    return (
        <div className='profile-page'>
            <header className="profile-header">
                <h2> PROFIL </h2>
            </header>
            <main className="profile-main">
                <section className="profile__head">
                    <div className="profile__picture">
                        <img src="" alt="profile-picture" />
                    </div>
                    <div className="profile__name">
                        <h3> Charles </h3>
                        <h3> Robart </h3>
                    </div>
                </section>
                <section className="profile__infos">
                    <div className="container">
                        <div className="container__header">
                            <h3> Infos </h3>
                            <p> Icone </p>
                        </div>
                        <div className="container__content">
                            <div className="age">
                                <p> Age </p>
                                <p> 34 ans </p>
                            </div>
                            <div className="gender">
                                <p> Sexe </p>
                                <p> Masculin </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="profile__sports">
                    <div className="container">
                        <div className="container__header">
                            <h3> Sports </h3>
                            <p> Icone </p>
                        </div>
                        <div className="container__content">
                            <p> Insert tableau </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default ProfilePage