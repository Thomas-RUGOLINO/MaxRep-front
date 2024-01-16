import './Form.scss'
import Button from '../Button/Button';

interface AddSportFormProps { 
    onSubmit: () => void,
    onClose: () => void
}

const AddSportForm = ({onSubmit, onClose}: AddSportFormProps) => { 

    //! Gérer la validation des données du formulaire
    //! Prévoir liste des sports en fonction de la catégorie choisie
    
    return (
        <form className='form addSportForm' method='post'>
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
                <Button text='Ajouter' color='black' onClick={onSubmit} />
                <Button text='Annuler' color='red' onClick={onClose} />
            </div>
        </form>
    )
}

export default AddSportForm;  