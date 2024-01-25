import './MenuDesktop.scss';
import {NavLink} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MenuDesktop = () => {

    const { logout, isAuthenticated } = useAuth()!; //Hook to get logout function from AuthContext, exclamation mark to tell TS that it's not null

    const handleLogout = () => {
        logout();
    }

    return (
        <nav className='menu-desktop'> 
            <NavLink to='/session' className={({ isActive }) => isActive ? 'menu-desktop__item active' : 'menu-desktop__item'}>
                <div className="menu-desktop__item">
                        <h3> SESSION </h3>
                </div>
            </NavLink>
            <NavLink to='/performance' className={({ isActive }) => isActive ? 'menu-desktop__item active' : 'menu-desktop__item'}>
                <div className="menu-desktop__item">
                        <h3> PERFORMANCE </h3>
                </div>
            </NavLink>
            <NavLink to='/ranking' className={({ isActive }) => isActive ? 'menu-desktop__item active' : 'menu-desktop__item'}>
                <div className="menu-desktop__item">
                        <h3> CLASSEMENT </h3>
                </div>
            </NavLink>
            <NavLink to='/profile' className={({ isActive }) => isActive ? 'menu-desktop__item active' : 'menu-desktop__item'}>
                <div className="menu-desktop__item">
                        <h3> PROFILE </h3>
                </div>
            </NavLink>
            <div className="menu-desktop__logout">
                    {isAuthenticated() && <i className="fa-solid fa-right-from-bracket" title='Se déconnecter' onClick={handleLogout}></i>}
            </div>
        </nav>
    )
}

export default MenuDesktop