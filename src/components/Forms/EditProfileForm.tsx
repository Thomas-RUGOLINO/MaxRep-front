import './Form.scss';
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import { countryNames } from '../../data/countriesList';

interface EditProfileFormProps { 
    userCurrentInfos: UserCurrentInfosProps,
    onClose: () => void, //Function to close modal with form button
    onProfileUpdate: () => void //Function to update profile infos in parent component
}

interface UserCurrentInfosProps { 
    firstname: string,
    lastname: string,
    birth_date: string,
    gender: string,
    city: string,
    country: string,
    height: number,
    weight: number,
    profile_picture: string,
    is_shared: boolean
}

const EditProfileForm = ({userCurrentInfos, onClose, onProfileUpdate}: EditProfileFormProps) => { 

    //Local state for handle inputs
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [userNewInfos, setUserNewInfos] = useState<UserCurrentInfosProps>(userCurrentInfos);

    const {token, userId } = useAuth()!; //Hook to get token and userId from AuthContext

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
        
        const value = (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement).value;  //Handle input type
        setUserNewInfos({
            ...userNewInfos,
            [e.target.name]: value
        });
    };

    const editUserProfile = async (e: React.FormEvent<HTMLFormElement>) => {  
        e.preventDefault();

            try {
                setIsLoading(true);
                const response = await axios.patch(`https://maxrep-back.onrender.com/api/profile/${userId}`, userNewInfos, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                onProfileUpdate();
                onClose();
                return response.data;
    
            } catch (error) {
                if (axios.isAxiosError(error)) { //== Case if axios error
                    if (error.response) {
                        setErrorMessage(error.response.data.error);
    
                    } else { //== Case if no response from server
                        setErrorMessage('Erreur interne du serveur.');
                    }
    
                } else { //== Case if not axios error
                    setErrorMessage('Une erreur inattendue est survenue.');
                }

            }  finally {
                setIsLoading(false);
            }  
    }    

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                    <form className='form editProfileForm' method='post' onSubmit={editUserProfile}>
                        <div className="form__errors">
                            <p className='error-message'> {errorMessage} </p>
                        </div>
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
                                <label htmlFor="birth_date">Date de naissance*</label>
                                <input 
                                    type="date" 
                                    name="birth_date" 
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
                                    <option value="Non binaire"> Non binaire </option>
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
                                <select name="country" id="" onChange={handleChange} value={userNewInfos.country}>
                                    {Object.entries(countryNames).map(([key, { name }]) => (
                                        <option key={key} value={name}>{name}</option>
                                    ))}
                                </select>
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
                                />
                            </div>
                            <div className='field'>
                                <label htmlFor="profile_picture">Photo de profil</label>
                                <input 
                                    type="text" 
                                    name="profile_picture"
                                    value={userNewInfos.profile_picture}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='field'>
                                <label htmlFor="is_shared">Partager mes performances ?</label>
                                <input 
                                    type='checkbox' 
                                    name='is_shared' 
                                    checked={userNewInfos.is_shared}
                                    onChange={handleChange}
                                    className='checkbox'
                                    />
                            </div>
                        <div className="form__buttons">
                            <Button text='Enregistrer' color='black' type='submit' />
                            <Button text='Annuler' color='red' onClick={onClose} type='button' />
                        </div>
                    </div>
                </form>
            )}
        </>
    )
}

export default EditProfileForm;  