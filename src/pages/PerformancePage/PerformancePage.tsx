import './PerformancePage.scss'
import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';

const PerformancePage = () => {
    return (
        <>
            <Header />
            <NavMenu />
            <div className="performance-page">
                <header className="performance-header">
                    <h2> Performance </h2>
                </header>
                <main>
                    <div className="sports-list">
                        <article className="sport">
                            <div className="sport__header">
                                <h3> Titre du sport </h3>
                                <i className="fa-solid fa-chevron-down"></i>
                            </div>
                            <div className="sport__content">
                                <p> React Charts </p>
                                <p> Ajouter une perf...</p>
                            </div>
                        </article>
                        <article className="sport">
                            <div className="sport__header">
                                <h3> Titre du sport </h3>
                                <i className="fa-solid fa-chevron-down"></i>
                            </div>
                            <div className="sport__content">
                                <p> React Charts </p>
                                <p> Ajouter une perf ...</p>
                            </div>
                        </article>
                    </div>
                </main>
            </div>
        </>
    )
}

export default PerformancePage