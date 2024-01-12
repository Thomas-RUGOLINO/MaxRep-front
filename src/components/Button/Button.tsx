import './Button.scss'

interface ButtonProps {
    text: string,
    color: 'black' | 'white' | 'red'
}

const Button = ({text, color}: ButtonProps) => {
    return (
        <>
            <button className={`button ${color}`} type='button'> {text} </button>
        </>
    )
}

export default Button