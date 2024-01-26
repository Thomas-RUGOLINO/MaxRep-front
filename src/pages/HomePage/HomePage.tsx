import './HomePage.scss';
import Header from '../../components/Header/Header';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HomePage = () => {

    const navigate = useNavigate(); //Hook to navigate to another page
    const { isAuthenticated, token, userId } = useAuth()!; //Hook to get token and userId from AuthContext if user is authenticated
    
    //Handle redirection if user is authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/profile');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId])
    
    return (
        <div className='home-page'>
            <Header />
            <main className='home-main'>
                <section className='home-firstpage'>
                    <button type='button' className='button black'> 
                        <Link to={'/login'} className='white'> CONNEXION </Link> 
                    </button>
                    <button type='button' className='button white'> 
                        <Link to={'/register'} className='black'> INSCRIPTION </Link> 
                    </button>
                    <div className="show-more">
                        <p> Voir plus </p>
                        <i className="icon fa-solid fa-chevron-down"></i>
                    </div>
                </section>
                <section className='home-secondpage'>
                    <p> Texte </p>
                </section>
            </main>
        </div>
    )
}

export default HomePage