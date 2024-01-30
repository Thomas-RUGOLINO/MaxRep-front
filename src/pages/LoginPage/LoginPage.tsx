import './LoginPage.scss'
import axios from 'axios';
import { useState , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';

const LoginPage = () => {

    //STATES
    const [userInfos, setUserInfos] = useState({
        email:'',
        password:'',
    });

    const navigate = useNavigate(); //Hook to navigate to another page
    const { isAuthenticated, login, token, userId } = useAuth()!; //Hook to get token and userId from AuthContext if user is authenticated

    //Handle redirection if user is authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/profile');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId])
    
    const [errorMessage, setErrorMessage] = useState<string>('');

    //UTILS
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        e.preventDefault();
        
        //Edit userInfos with new target value for changed input
        setUserInfos({
            ...userInfos,
            [e.target.name]: e.target.value
        });
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setErrorMessage(''); //Init empty error messages
        
        //Push userInfos to backend
        try {
            const response = await axios.post('https://maxrep-back.onrender.com/api/login' , userInfos);

            if (response.status !== 200) {
                setErrorMessage(response.data.error);
            }

            const token = response.data;
            login(token); //Login user with token
            navigate(`/profile`);

            return response.data;

        } catch (error) {
            if (axios.isAxiosError(error)) { //== Case if axios error
                if (error.response) {
                    setErrorMessage(error.response.data.error);

                } else { //== Case if no response from server
                    setErrorMessage('Erreur interne du serveur.');
                }

            } else { //== Case if not axios error
                setErrorMessage('Une erreur inattendue est survenue.');
            }
        }
    }

    return (
        <div className='login-page'>
            <Header />
            <main className='login-main'>
                <section className='login-form'>
                    <form className='form' method='post' onSubmit={handleFormSubmit}>
                        <div className="form__title">
                            <h3> Connexion </h3>
                        </div>
                        <div className="form__errors">
                            <p className='error-message'> {errorMessage} </p>
                        </div>
                        <div className="form__inputs">
                            <div className='input'> 
                                <i className="icon fa-solid fa-at"></i>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={userInfos.email}
                                    onChange={handleInputChange}
                                    placeholder='Entrez votre email' 
                                    required 
                                />
                            </div>
                            <div className='input'> 
                                <i className="icon fa-solid fa-unlock"></i>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={userInfos.password}
                                    onChange={handleInputChange}
                                    placeholder='Entrez votre mot de passe' 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form__buttons">
                            <button type='submit'> CONNEXION </button>
                        </div>
                        <div className="form__message">
                            <Link to='/register'>
                                <p> Pas de compte ? Inscrivez-vous ici ! </p>
                            </Link>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    )
}

export default LoginPage