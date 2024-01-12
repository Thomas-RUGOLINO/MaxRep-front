import { useEffect } from 'react'
import './RegisterPage.scss'
import axios from 'axios'

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
        <>
            <h1> Register page </h1>
        </>
    )
}

export default RegisterPage