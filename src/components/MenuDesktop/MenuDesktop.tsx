import './MenuDesktop.scss';
import {NavLink} from 'react-router-dom';

const MenuDesktop = () => {

    return (
        <>
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
            </nav>
        </>
    )
}

export default MenuDesktop