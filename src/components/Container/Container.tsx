import './Container.scss'

interface ContainerProps {
    children: React.ReactNode;
}

const Container = ({children}: ContainerProps) => {
    return (
        <>
            <section className='container'> 
                {children}
            </section>
        </>
    )
}

export default Container