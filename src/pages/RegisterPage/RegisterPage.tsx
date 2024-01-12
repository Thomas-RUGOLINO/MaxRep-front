import './RegisterPage.scss'
import axios from 'axios'
import { useEffect } from 'react'
import Header from '../../components/Header/Header'

const RegisterPage = () => {

    useEffect(() => {
        getUsers();
    })

    //Testing API endpoint
    const getUsers = async () => {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
            console.log(response.data);

        } catch (error) {
            console.error(error)  
        }
    }

    return (
        <div className='register-page'>
            <Header />
            <main className='register-main'>
                <section className='register-form'>
                    <form className='form' action="" method='post'>
                        <div className="form__title">
                            <h3> Inscription </h3>
                        </div>
                        <div className="form__inputs">
                            <div className='input'> 
                                <i className="icon fa-solid fa-at"></i>
                                <input type="email" placeholder='Entrer votre email' />
                            </div>
                            <div className='input'> 
                                <i className="icon fa-solid fa-unlock"></i>
                                <input type="password" placeholder='Entrer votre mot de passe' />
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