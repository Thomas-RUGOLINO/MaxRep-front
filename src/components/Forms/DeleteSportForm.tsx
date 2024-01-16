import './Form.scss'
import Button from '../Button/Button';

interface DeleteSportFormProps { 
    onSubmit: () => void,
    onClose: () => void
}

const DeleteSportForm = ({onSubmit, onClose}: DeleteSportFormProps) => { 

    return (
        <form className='form DeleteSportForm' method='post'>
            <div className="form__fields">
                <p> Êtes-vous sur de vouloir supprimer ce sport ? </p>
            </div>
            <div className="form__buttons">
                <Button text='Valider' color='black' onClick={onSubmit} />
                <Button text='Annuler' color='red' onClick={onClose} />
            </div>
        </form>
    )
}

export default DeleteSportForm;  