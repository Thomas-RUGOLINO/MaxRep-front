import './ErrorPage.scss'

interface ErrorPageProps {
    status:number,
    message:string
}

const ErrorPage = ({status, message}: ErrorPageProps) => {
    return (
        <div className='error-page'>
            <img src="/assets/images/404.gif" alt="404" />
            <h1> Erreur {status} </h1>
            <p> {message} </p>
        </div>
    )
}

export default ErrorPage