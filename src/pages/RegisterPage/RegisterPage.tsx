import './RegisterPage.scss'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header'
import { useState ,useEffect } from 'react'
import DOMPurify from 'dompurify';

const RegisterPage = () => {

    const navigate = useNavigate();
    const { isAuthenticated,  token, userId } = useAuth()!;

    const [userInfos, setUserInfos] = useState({
        email:'',
        password:'',
        passwordConfirm: '',
        lastname: '', 
        firstname:'',
        birthDate: '',
        gender:'Homme'
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    //Handle redirection if user is authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/profile');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        e.preventDefault();
        const sanitizedValue = DOMPurify.sanitize(e.target.value);
        //Edit userInfos with new target value for changed input
        setUserInfos({
            ...userInfos,
            [e.target.name]: sanitizedValue
        });
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setErrorMessage(''); //Init empty error messages

        //Comparing passwords before sending request
        if (userInfos.password !== userInfos.passwordConfirm) {
            return setErrorMessage('Les mots de passe ne correspondent pas !');
        }
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register` , userInfos);

            //Redirect to login page after successful registration
            navigate(`/login`);
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
        <div className='register-page'>
            <Header />
            <main className='register-main'>
                <section className='register-form'>
                    <form className='form' method='post' onSubmit={handleFormSubmit}>
                        <div className="form__title">
                            <h3> Inscription </h3>
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
                                    placeholder='Votre email' 
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
                                    placeholder='Votre mot de passe' 
                                    required 
                                />
                            </div>
                            <div className='input'> 
                                <i className="icon fa-solid fa-unlock"></i>
                                <input 
                                    type="password" 
                                    name="passwordConfirm" 
                                    value={userInfos.passwordConfirm} 
                                    onChange={handleInputChange} 
                                    placeholder='Confirmer votre mot de passe' 
                                    required
                                />
                            </div>
                            <div className='input'> 
                                <i className="icon fa-solid fa-user"></i>
                                <input 
                                    type="text" 
                                    name="lastname" 
                                    value={userInfos.lastname} 
                                    onChange={handleInputChange} 
                                    placeholder='Votre nom' 
                                    required
                                />
                            </div>
                            <div className='input'> 
                                <i className="icon fa-solid fa-user"></i>
                                <input 
                                    type="text" 
                                    name="firstname" 
                                    value={userInfos.firstname} 
                                    onChange={handleInputChange} 
                                    placeholder='Votre prénom' 
                                    required
                                />
                            </div>
                            <div className='input'> 
                                <i className="icon fa-solid fa-calendar-days"></i>
                                <input 
                                    type="date" 
                                    name="birthDate" 
                                    value={userInfos.birthDate} 
                                    onChange={handleInputChange} 
                                    placeholder='Votre date de naissance'
                                    required 
                                />
                            </div>
                            <div className='input'> 
                                <i className="icon fa-solid fa-venus-mars"></i>
                                <select name="gender" value={userInfos.gender} onChange={handleInputChange} required>
                                    <option value="Homme"> Homme </option>
                                    <option value="Femme"> Femme </option>
                                    <option value="Non binaire"> Non binaire </option>
                                </select>
                            </div>
                        </div>
                        <div className="form__buttons">
                            <button type='submit'> INSCRIPTION </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    )
}

export default RegisterPage