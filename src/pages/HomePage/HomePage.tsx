import './HomePage.scss';
import Header from '../../components/Header/Header';
import { useEffect, useRef } from 'react';
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

    //Handle scroll to second page
    const secondPage = useRef<HTMLDivElement>(null);
    const scrollToSecondPage = () => { 
        if (secondPage.current) { 
            secondPage.current.scrollIntoView({ behavior: 'smooth' }); 
        }
    }
    
    return (
        <div className='home-page'>
            <Header />
            <main className='home-main'>
                <section className='home-landing'>
                    <button type='button' className='button black'> 
                        <Link to={'/login'} className='white'> CONNEXION </Link> 
                    </button>
                    <button type='button' className='button white'> 
                        <Link to={'/register'} className='black'> INSCRIPTION </Link> 
                    </button>
                    <div className="show-more" onClick={scrollToSecondPage}>
                        <p> Voir plus </p>
                        <i className="icon fa-solid fa-chevron-down"></i>
                    </div>
                </section>
                <section ref={secondPage} className='home-presentation'>
                    <div className="content">
                        <p> Présentation de l'appli </p>
                        <div className="screenshots">
                            <img src="/assets/images/screen-session.png" alt="session-page" />
                            <img src="/assets/images/screen-performance.png" alt="performance-page" />
                        </div>
                    </div>
                    <footer className='footer'>
                        <p> Site créé par Charles, Thomas & Antoine... Contenu à définir </p>
                    </footer>
                </section>
            </main>
        </div>
    )
}

export default HomePage