import './LoginPage.scss'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header'

interface DecodedToken {
    id: number; 
    firstname: string;
    lastname: string;
}

const LoginPage = () => {

    //STATES
    const [userInfos, setUserInfos] = useState({
        email:'',
        password:'',
    });

    const navigate = useNavigate();
    
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

            if (response.status === 200) {
                const token = response.data;
                localStorage.setItem('userToken' , token);

                //Get userId from userToken 
                const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
                const userId = decodedToken.id;
                navigate(`/profile/${userId}`);

                return response.data;

            } else {
                return console.log('Connexion impossible'); //! Display an error message on form
            }

        } catch (error) {
            console.log(error);
            return console.log('Connexion impossible'); //! Display an error message on form
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
                    </form>
                </section>
            </main>
        </div>
    )
}

export default LoginPage