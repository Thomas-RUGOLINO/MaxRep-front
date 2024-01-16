import './Form.scss'
import Button from '../Button/Button';

interface DeleteSportFormProps { 
    userId: number,
    sportId: number | null,
    onClose: () => void
}

const DeleteSportForm = ({userId, sportId, onClose}: DeleteSportFormProps) => { 

    const handleSubmit = (e: { preventDefault: () => void; }) => { 
        e.preventDefault();
        console.log('submit userId :' , userId , sportId);
    }

    return (
        <form className='form DeleteSportForm' method='post' onSubmit={handleSubmit}>
            <div className="form__fields">
                <p style={{textAlign: 'center'}}> Êtes-vous sur de vouloir supprimer ce sport ? </p>
            </div>
            <div className="form__buttons">
                <Button text='Valider' color='black' type='submit' />
                <Button text='Annuler' color='red' onClick={onClose} type='button' />
            </div>
        </form>
    )
}

export default DeleteSportForm;  