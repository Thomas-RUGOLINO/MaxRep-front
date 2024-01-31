import './Header.scss';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuDesktop from '../MenuDesktop/MenuDesktop';

const Header = () => {

    const { logout, isAuthenticated } = useAuth()!;

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
                <div className="header__menu">
                    {isAuthenticated() && (
                        <>
                        <MenuDesktop />
                        <div className="logout">
                            {isAuthenticated() && <i className="icon fa-solid fa-right-from-bracket" title='Se déconnecter' onClick={handleLogout}></i>}
                        </div>
                        </>
                    )}
                </div>
            </header>
        </>
    )
}

export default Header