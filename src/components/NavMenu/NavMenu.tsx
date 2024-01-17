import './NavMenu.scss';
import {NavLink} from 'react-router-dom';

const NavMenu = () => {
    return (
        <nav className='nav'> 
            <NavLink to='/session' className={({ isActive }) => isActive ? 'nav__item active' : 'nav__item'}>
                <div className="nav__item">
                        <i className="fa-solid fa-calendar-days"></i>
                        <p> SESSION </p>
                </div>
            </NavLink>
            <NavLink to='/performance' className={({ isActive }) => isActive ? 'nav__item active' : 'nav__item'}>
                <div className="nav__item">
                        <i className="icon-table fa-solid fa-chart-line"></i>
                        <p> PERFORMANCE </p>
                </div>
            </NavLink>
            <NavLink to='/ranking' className={({ isActive }) => isActive ? 'nav__item active' : 'nav__item'}>
                <div className="nav__item">
                        <i className="fa-solid fa-ranking-star"></i>
                        <p> CLASSEMENT </p>
                </div>
            </NavLink>
            <NavLink to='/profile' className={({ isActive }) => isActive ? 'nav__item active' : 'nav__item'}>
                <div className="nav__item">
                        <i className="fa-solid fa-user"></i>
                        <p> PROFILE </p>
                </div>
            </NavLink>
        </nav>
    )
}

export default NavMenu