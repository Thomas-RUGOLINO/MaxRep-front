import './NavMenu.scss';
import {NavLink} from 'react-router-dom';

const NavMenu = () => {
    return (
        <nav className='nav'> 
            <NavLink to='/session'>
                <div className="nav__item">
                        <i className="fa-solid fa-calendar-days"></i>
                        <p> SESSION </p>
                </div>
            </NavLink>
            <NavLink to='/performance'>
                <div className="nav__item">
                        <i className="icon-table fa-solid fa-chart-line"></i>
                        <p> PERFORMANCE </p>
                </div>
            </NavLink>
            <NavLink to='ranking'>
                <div className="nav__item">
                        <i className="fa-solid fa-ranking-star"></i>
                        <p> CLASSEMENT </p>
                </div>
            </NavLink>
            <NavLink to='profile/13'>
                <div className="nav__item">
                        <i className="fa-solid fa-user"></i>
                        <p> PROFILE </p>
                </div>
            </NavLink>
        </nav>
    )
}

export default NavMenu