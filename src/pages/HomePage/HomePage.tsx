import './HomePage.scss';
import Header from '../../components/Header/Header';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMediaQuery } from 'react-responsive';

const HomePage = () => {

    const navigate = useNavigate();
    const { isAuthenticated, token, userId } = useAuth()!;
    
    //Handle redirection if user is authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/profile');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated, navigate, token, userId])

    const isMobile = useMediaQuery({
        query: '(max-width: 768px)'
      }) 

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
                <section  className='home-presentation'>
                    <div  className="content">
                        <h1 ref={secondPage} className='content__title'> MAXREP </h1>
                        <p className='content__text'> Maxrep est l'outil idéal pour les passionnés de sport souhaitant suivre et améliorer leurs performances. <br/> <br />
                        Cette application intuitive vous permet de suivre vos progrès dans diverses disciplines sportives, vous aidant à atteindre vos objectifs avec précision et motivation. </p>
                        <div className="content__screenshots">
                            <img src="/assets/images/screen-session.png" alt="session-page" />
                            <img src="/assets/images/screen-performance.png" alt="performance-page" />
                            {!isMobile && <img src="/assets/images/screen-ranking.png" alt="ranking-page" />}
                        </div>
                    </div>
                    <footer className='footer'>
                        <p> Application développée par Charles Robart, Thomas Rugolino & Antoine Grubert. </p>
                    </footer>
                </section>
            </main>
        </div>
    )
}

export default HomePage