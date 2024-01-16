import './Form.scss';
import Button from '../Button/Button';

interface EditProfileFormProps { 
    onClose: () => void
}

const EditProfileForm = ({onClose}: EditProfileFormProps) => { 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        console.log('submit form')
    }

    return (
        <form className='form editProfileForm' method='post' onSubmit={handleSubmit}>
            <div className="form__fields">
                <div className="field">
                    <label htmlFor="lastname">Nom</label>
                    <input type="text" name="lastname" required />
                </div>
                <div className="field">
                    <label htmlFor="firstname">Prénom</label>
                    <input type="text" name="firstname" required />
                </div>
                <div className="field">
                    <label htmlFor="birthDate">Date de naissance</label>
                    <input type="date" name="birthDate" required />
                </div>
                <div className="field">
                    <label htmlFor="gender"> Sexe </label>
                    <select name="gender">
                        <option value="Homme"> Homme </option>
                        <option value="Femme"> Femme </option>
                        <option value="Non binary"> Non binaire </option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="city">Ville</label>
                    <input type="text" name="city"/>
                </div>
                <div className="field">
                    <label htmlFor="country">Pays</label>
                    <input type="text" name="country"/>
                </div>
                <div className="field">
                    <label htmlFor="height">Taille</label>
                    <input type="number" name="height"/>
                </div>
                <div className="field">
                    <label htmlFor="weight">Poids</label>
                    <input type="number" name="weight"/>
                </div>
            </div>
            <div className="form__buttons">
                <Button text='Enregistrer' color='black' onClick={() => handleSubmit} />
                <Button text='Annuler' color='red' onClick={onClose} />
            </div>
            
        </form>
    )
}

export default EditProfileForm;  