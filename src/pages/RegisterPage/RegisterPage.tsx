import './RegisterPage.scss'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header'
import { useState } from 'react'

const RegisterPage = () => {

    //STATES
    const [userInfos, setUserInfos] = useState({
        email:'',
        password:'',
        passwordConfirm: '',
        lastname: '', 
        firstname:'',
        birthDate: '',
        gender:'man'
    });

    const navigate = useNavigate();

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
        setErrorMessage(''); //Init empty error messages

        //Comparing passwords
        if (userInfos.password !== userInfos.passwordConfirm) {
            return setErrorMessage('Les mots de passe ne correspondent pas !')
        }
        
        //Push userInfos to backend
        try {
            const response = await axios.post('https://maxrep-back.onrender.com/api/register' , userInfos);
            
            if (response.status === 201) {
                navigate(`/login`);

            } else {
                return console.log('Register failed'); //! Display an error message on form
            }

        } catch (error) {
            console.log(error);
            return console.log('Register failed'); //! Display an error message on form
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
                                />
                            </div>
                            <div className='input'> 
                                <i className="icon fa-solid fa-venus-mars"></i>
                                <select name="gender" id="" value={userInfos.gender} onChange={handleInputChange} required>
                                    <option value="male"> Homme </option>
                                    <option value="female"> Femme </option>
                                    <option value="non-binary"> Non binaire </option>
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