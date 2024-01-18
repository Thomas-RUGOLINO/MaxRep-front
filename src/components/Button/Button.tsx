import './Button.scss'

interface ButtonProps {
    text: string,
    color: 'black' | 'white' | 'red',
    type: 'button' | 'submit',
    isSmall?: boolean,
    onClick?: () => void,
}

const Button = ({text, color, type, isSmall, onClick}: ButtonProps) => {
    return (
        <>
            <button 
                onClick={onClick} 
                className={`button ${color}`} 
                type={type}
                style={{padding: isSmall ? '5px 0px' : '12px 20px'}}
            > 
                {text} 
            </button>
        </>
    )
}

export default Button