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
        <div className='mobile-page register-page'>
            <Header />
            <main className='register-main'>
                <section className='register-form'>
                    <form action="">
                        <div className="form__title">
                            <h3> Inscription </h3>
                        </div>
                        <div className="form__inputs">
                            <input type="email" placeholder='Entrer votre email' />
                        </div>
                        <div className="form__buttons">
                            <button type='submit'> Inscription </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    )
}

export default RegisterPage