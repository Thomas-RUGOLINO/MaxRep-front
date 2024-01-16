import './Button.scss'

interface ButtonProps {
    text: string,
    color: 'black' | 'white' | 'red',
    onClick?: () => void
}

const Button = ({text, color, onClick}: ButtonProps) => {
    return (
        <>
            <button onClick={onClick} className={`button ${color}`} type='button'> {text} </button>
        </>
    )
}

export default Button