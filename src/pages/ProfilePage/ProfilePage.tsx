import './ProfilePage.scss';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
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
    sports: UserSportsProps[]
}

interface UserSportsProps { 
    id:number,
    name:string
}

interface ErrorProps {
    status:number,
    message:string
}

const ProfilePage = () => {

    const [userInfos, setUserInfos] = useState<UserInfosProps | null>(null);
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
                                    <i className="icon fa-solid fa-pen-to-square"></i>
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
                                        {userInfos.sports.length > 0 && userInfos.sports.map(sport => (
                                            <tr key={sport.id}>
                                                <td> <i className="icon-table fa-solid fa-chart-line"></i> </td>
                                                <td> {sport.name} </td>
                                                <td> Aucune </td>
                                                <td> <i className="icon-table fa-solid fa-xmark"></i> </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </main>
                </div>
            </>
            )}
        
        </>
    )
}

export default ProfilePage