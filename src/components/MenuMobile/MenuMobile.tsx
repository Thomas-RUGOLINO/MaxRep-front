import './MenuMobile.scss';
import {NavLink} from 'react-router-dom';

const MenuMobile = () => {
    return (
        <nav className='menu-mobile'> 
            <NavLink to='/session' className={({ isActive }) => isActive ? 'menu-mobile__item active' : 'menu-mobile__item'}>
                <div className="menu-mobile__item">
                        <i className="fa-solid fa-calendar-days"></i>
                        <p> SESSIONS </p>
                </div>
            </NavLink>
            <NavLink to='/performance' className={({ isActive }) => isActive ? 'menu-mobile__item active' : 'menu-mobile__item'}>
                <div className="menu-mobile__item">
                        <i className="icon-table fa-solid fa-chart-line"></i>
                        <p> PERFORMANCE </p>
                </div>
            </NavLink>
            <NavLink to='/ranking' className={({ isActive }) => isActive ? 'menu-mobile__item active' : 'menu-mobile__item'}>
                <div className="menu-mobile__item">
                        <i className="fa-solid fa-ranking-star"></i>
                        <p> CLASSEMENT </p>
                </div>
            </NavLink>
            <NavLink to='/profile' className={({ isActive }) => isActive ? 'menu-mobile__item active' : 'menu-mobile__item'}>
                <div className="menu-mobile__item">
                        <i className="fa-solid fa-user"></i>
                        <p> PROFIL </p>
                </div>
            </NavLink>
        </nav>
    )
}

export default MenuMobile