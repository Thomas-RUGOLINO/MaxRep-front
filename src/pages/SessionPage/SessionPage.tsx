import './SessionPage.scss'
import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import Button from '../../components/Button/Button';

const SessionPage = () => {
    return (
        <>
            <Header />
            <NavMenu />
            <div className="session-page">
                <header className="session-header">
                    <h2> Sessions </h2>
                </header>
                <main>
                    <section className='calendar-container'> 
                        Calendrier à ajouter 
                    </section>
                    <section className="agenda-container">
                        <div className="agenda">
                            <div className="agenda__spirals">
                                <span className="spiral"></span>
                                <span className="spiral"></span>
                                <span className="spiral"></span>
                                <span className="spiral"></span>
                                <span className="spiral"></span>
                                <span className="spiral"></span>
                                <span className="spiral"></span>
                                <span className="spiral"></span>
                            </div>
                            <div className="agenda__header">
                                <h3> Jeudi 15 janvier 2024 </h3>
                                <i className="fa-solid fa-circle-plus" title='Ajouter une session'></i>
                            </div>
                            <div className="agenda__sessions">
                                <div className="session">
                                    <i className="icon fa-solid fa-pen-to-square" title='Editer la session'></i>
                                    <p className='session__title'> <strong>Session de Marathon</strong> </p>
                                    <p className='session__desc'> Description de la session, à limiter en overflow ! </p>
                                    <div className="session__score"> 
                                        <form action="">
                                            <label htmlFor='score'> Score : </label>
                                            <input type='number' name='score' className='score__value' />
                                            <Button text='Ajouter' color='black' type='submit' isSmall />
                                        </form>
                                    </div>
                                </div>
                                <div className="session">
                                    <i className="icon fa-solid fa-pen-to-square" title='Editer la session'></i>
                                    <p className='session__title'> <strong>Session de Marathon</strong> </p>
                                    <p className='session__desc'> Description de la session, à limiter en overflow ! </p>
                                    <div className="session__score"> 
                                        <form action="">
                                            <label htmlFor='score'> Score : </label>
                                            <input type='number' name='score' className='score__value' />
                                            <Button text='Ajouter' color='black' type='submit' isSmall />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    )
}

export default SessionPage