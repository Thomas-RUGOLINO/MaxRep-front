import './ErrorPage.scss'

interface ErrorPageProps {
    status:number,
    message:string
}

const ErrorPage = ({status, message}: ErrorPageProps) => {
    return (
        <>
            <h1> Erreur {status} </h1>
            <h3> {message} </h3>
        </>
    )
}

export default ErrorPage