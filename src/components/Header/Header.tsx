import './Header.scss';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {

    const { logout, isAuthenticated } = useAuth()!; //Hook to get logout function from AuthContext, exclamation mark to tell TS that it's not null

    const handleLogout = () => {
        logout();
    }

    return (
        <>
            <header className="header">
                <div className="header__title">
                    <Link to='/'> 
                        <img src="/assets/logo/maxrep-logo.png" alt="" title="Retour page d'accueil"/> 
                    </Link>
                    {/* <h1> MaxRep </h1> */}
                </div>
                <div className="header__logout">
                    {isAuthenticated() && <i className="fa-solid fa-right-from-bracket" title='Se déconnecter' onClick={handleLogout}></i>}
                </div>
            </header>
        </>
    )
}

export default Header