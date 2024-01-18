import './Loader.scss';

interface LoaderProps { 
    isPage?: boolean
}

const Loader = ({isPage}: LoaderProps) => {
    return (
        <>
            <div className="loader-container" style={isPage ? { minHeight: '90vh' } : undefined}>
                <span className="loader"></span>
            </div>
        </>
    )
}

export default Loader