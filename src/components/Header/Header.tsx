import './Header.scss';
import { Link } from 'react-router-dom';
import MenuDesktop from '../MenuDesktop/MenuDesktop';

const Header = () => {


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
                    <MenuDesktop />
                </div>
            </header>
        </>
    )
}

export default Header