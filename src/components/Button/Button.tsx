import './Button.scss'

interface ButtonProps {
    text: string,
    color: 'black' | 'white' | 'red',
    type: 'button' | 'submit',
    onClick?: () => void
}

const Button = ({text, color, type, onClick}: ButtonProps) => {
    return (
        <>
            <button onClick={onClick} className={`button ${color}`} type={type}> {text} </button>
        </>
    )
}

export default Button