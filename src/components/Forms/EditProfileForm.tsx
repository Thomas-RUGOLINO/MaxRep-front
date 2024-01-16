import './Form.scss';
import { useState } from 'react';
import Button from '../Button/Button';

interface EditProfileFormProps { 
    userId: number,
    userCurrentInfos: UserCurrentInfosProps,
    onClose: () => void
}

interface UserCurrentInfosProps { 
    firstname: string,
    lastname: string,
    birth_date: string,
    gender: string,
    city: string,
    country: string,
    height: number,
    weight: number
}

const EditProfileForm = ({userId, userCurrentInfos, onClose}: EditProfileFormProps) => { 

    //Local state for handle inputs
    const [userNewInfos, setUserNewInfos] = useState<UserCurrentInfosProps>(userCurrentInfos);

    const handleChange = (e: { target: { name: string; value: unknown; }; }) => {
        setUserNewInfos({
            ...userNewInfos,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: { preventDefault: () => void; }) => { 
        e.preventDefault();
        console.log('submit new infos :' , userId, userNewInfos);
    }

    //! Gérer la validation des données du formulaire

    return (
        <form className='form editProfileForm' method='post' onSubmit={handleSubmit}>
            <div className="form__fields">
                <div className="field">
                    <label htmlFor="lastname">Nom*</label>
                    <input 
                        type="text" 
                        name="lastname" 
                        value={userNewInfos.lastname} 
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="field">
                    <label htmlFor="firstname">Prénom*</label>
                    <input 
                        type="text" 
                        name="firstname" 
                        value={userNewInfos.firstname} 
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="field">
                    <label htmlFor="birthDate">Date de naissance*</label>
                    <input 
                        type="date" 
                        name="birthDate" 
                        value={userNewInfos.birth_date} 
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="field">
                    <label htmlFor="gender"> Sexe* </label>
                    <select name="gender" value={userNewInfos.gender} onChange={handleChange}>
                        <option value="Homme"> Homme </option>
                        <option value="Femme"> Femme </option>
                        <option value="Non binary"> Non binaire </option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="city">Ville</label>
                    <input 
                        type="text" 
                        name="city" 
                        value={userNewInfos.city} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="field">
                    <label htmlFor="country">Pays</label>
                    <input 
                        type="text" 
                        name="country" 
                        value={userNewInfos.country} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="field">
                    <label htmlFor="height">Taille (cm)</label>
                    <input 
                        type="number" 
                        name="height" 
                        value={userNewInfos.height} 
                        onChange={handleChange}
                    />
                </div>
                <div className="field">
                    <label htmlFor="weight">Poids (kg)</label>
                    <input 
                        type="number" 
                        name="weight" 
                        value={userNewInfos.weight} 
                        onChange={handleChange}
                        required 
                    />
                </div>
            </div>
            <div className="form__buttons">
                <Button text='Enregistrer' color='black' type='submit' />
                <Button text='Annuler' color='red' onClick={onClose} type='button' />
            </div>
            
        </form>
    )
}

export default EditProfileForm;  