import './Form.scss'
import Button from '../Button/Button';

interface AddSportFormProps { 
    userId: number,
    onClose: () => void
}

const AddSportForm = ({userId, onClose}: AddSportFormProps) => { 

    //! Prévoir liste des sports en fonction de la catégorie choisie

    const handleSubmit = (e: { preventDefault: () => void; }) => { 
        e.preventDefault();
        console.log('submit userId :' , userId);
        //! Ajouter axios et gérer les erreurs et les validation de formulaires
    }

    return (
        <form className='form addSportForm' method='post' onSubmit={handleSubmit}>
            <div className="form__fields">
                <div className="field">
                    <label htmlFor="category"> Sélectionner une catégorie </label>
                    <select name="category">
                        <option value="run"> Running </option>
                        <option value="crossfit"> Crossfit </option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="sport"> Sélectionner une catégorie </label>
                    <select name="sport">
                        <option value="marathon"> Marathon </option>
                        <option value="100m"> 100m </option>
                    </select>
                </div>
            </div>
            <div className="form__buttons">
                <Button text='Ajouter' color='black' type='submit' />
                <Button text='Annuler' color='red' onClick={onClose} type='button' />
            </div>
        </form>
    )
}

export default AddSportForm;  