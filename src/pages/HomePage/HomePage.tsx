import './HomePage.scss'
import Header from '../../components/Header/Header'
import { Link } from 'react-router-dom'

const HomePage = () => {
    
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