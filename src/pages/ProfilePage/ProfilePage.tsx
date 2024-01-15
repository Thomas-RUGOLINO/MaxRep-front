import './ProfilePage.scss';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

interface DecodedToken {
    id: number; 
    firstname: string;
    lastname: string;
}

const ProfilePage = () => {

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
        <>
            <h1> Hello </h1>
        </>
    )
}

export default ProfilePage