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

            } catch (error) {
                console.error(error);
            }

        } else {
            //! Si pas de token envoyer sur une page d'erreur
            console.log('No token')
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