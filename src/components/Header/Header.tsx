import './Header.scss'

const Header = () => {

    return (
        <>
            <header className="header">
                <div className="header__logo">
                    <img src="/assets/logo/maxrep-logo.png" alt="" />
                </div>
                <div className="header__title">
                    <h1> MaxRep </h1>
                </div>
            </header>
        </>
    )
}

export default Header