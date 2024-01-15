import './ProfilePage.scss';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import ErrorPage from '../ErrorPage/ErrorPage';

interface DecodedTokenProps {
    id: number; 
    firstname: string;
    lastname: string;
}

interface ErrorProps {
    status:number,
    message:string
}

const ProfilePage = () => {

    const [userInfos, setUserInfos] = useState({});
    //! Add a loader state
    const [error, setError] = useState<ErrorProps | null>(null);

    const getUserProfile = async () => {

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
                console.log(response);

                //== Case response is forbidden 
                if (response.status === 401) {
                    setError({status:401, message:response.data.error});
                }
                
                //== Case response is ok
                if (response.status === 200) {
                    setUserInfos(response.data);
                    console.log(userInfos);
                } 

            } catch (error) {
                console.error(error);
                setError({status:500, message:'Server error / Erreur serveur'});
            }

        //If there is no token
        } else {
            setError({status:401, message:'Unauthorized / Non autorisé'});
        }
    }

    useEffect(() => {
        getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    //Handle if there is an error 
    // if (error) {
    //     return <ErrorPage status={error.status} message={error.message} />
    // }

    //!Handle loader

    return (
        <> 
        <Header />
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
                        <h3> Charles </h3>
                        <h3> Robart </h3>
                    </div>
                </section>
                <section className="profile__infos">
                    <div className="container">
                        <div className="container__header">
                            <h3> Infos </h3>
                            <i className="icon fa-solid fa-pen-to-square"></i>
                        </div>
                        <div className="container__content">
                            <div className="info age">
                                <p> <strong>Age</strong> </p>
                                <p> 34 ans </p>
                            </div>
                            <div className="info gender">
                                <p> <strong>Sexe</strong> </p>
                                <p> Masculin </p>
                            </div>
                            <div className="info city">
                                <p> <strong>Ville</strong> </p>
                                <p> Montrueil </p>
                            </div>
                            <div className="info country">
                                <p> <strong>Pays</strong> </p>
                                <p> France </p>
                            </div>
                            <div className="info height">
                                <p> <strong>Taille</strong> </p>
                                <p> 193cm </p>
                            </div>
                            <div className="info weight">
                                <p> <strong>Poids</strong> </p>
                                <p> 98kg </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="profile__sports">
                    <div className="container">
                        <div className="container__header">
                            <h3> Sports </h3>
                            <i className="icon fa-regular fa-square-plus"></i>
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
                                <tr>
                                    <td> <i className="icon-table fa-solid fa-chart-line"></i> </td>
                                    <td> Marathon </td>
                                    <td> 3h30min </td>
                                    <td> <i className="icon-table fa-solid fa-xmark"></i> </td>
                                </tr>
                                <tr>
                                    <td> <i className="icon-table fa-solid fa-chart-line"></i> </td>
                                    <td> Marathon </td>
                                    <td> 3h30min </td>
                                    <td> <i className="icon-table fa-solid fa-xmark"></i> </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
        </>
    )
}

export default ProfilePage