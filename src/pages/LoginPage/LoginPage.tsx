import './LoginPage.scss'
import axios from 'axios';
import { useState } from 'react';
import Header from '../../components/Header/Header'

const LoginPage = () => {

    //STATES
    const [userInfos, setUserInfos] = useState({
        email:'',
        password:'',
    });
    
    const [errorMessage, setErrorMessage] = useState<string>('');

    //UTILS
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        e.preventDefault();
        console.log('name: ' , e.target.name , 'targetvalue: ' , e.target.value )
        
        //Edit userInfos with new target value for changed input
        setUserInfos({
            ...userInfos,
            [e.target.name]: e.target.value
        });
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        console.log(userInfos);
        setErrorMessage(''); //Init empty error messages
        
        //Push userInfos to backend
        try {
            const response = await axios.post('https://maxrep-back.onrender.com/api/login' , userInfos);
            //!Get status and handle it -> get token if status 201 or error message authentification failed
            console.log('response: ' , response);

        } catch (error) {
            console.log(error);
            //!Define and display error message
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