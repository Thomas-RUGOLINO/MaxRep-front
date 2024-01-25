import './Container.scss';

interface ContainerProps { 
    children: React.ReactNode

}

const Container = ({children}: ContainerProps) => {
    return (
        <div className='container'>
            {children}
        </div>
    )
}

export default Container