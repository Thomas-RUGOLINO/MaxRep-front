import './Form.scss';
import axiosInstance from '../../services/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import Button from '../Button/Button';

interface EditProfileFormProps { 
    userId: number,
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

interface DecodedTokenProps {
    id: number; 
    firstname: string;
    lastname: string;
}

const EditProfileForm = ({userId, userCurrentInfos, onClose, onProfileUpdate}: EditProfileFormProps) => { 

    //Local state for handle inputs
    const [userNewInfos, setUserNewInfos] = useState<UserCurrentInfosProps>(userCurrentInfos);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
        
        const value = (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement).value;  //Handle input type
        setUserNewInfos({
            ...userNewInfos,
            [e.target.name]: value
        });
    };

    const editUserProfile = async (e: React.FormEvent<HTMLFormElement>) => {  
        e.preventDefault();
        console.log('submit new infos :' , userId, userNewInfos);

        const token = localStorage.getItem('userToken');

        if (token) {
            const decodedTokenProps: DecodedTokenProps = jwtDecode<DecodedTokenProps>(token);
            const userId = decodedTokenProps.id;

            try {
                console.log(userNewInfos)
                const response = await axiosInstance.patch(`/profile/${userId}`, userNewInfos, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response);
                if (response.status === 200) {
                    onProfileUpdate();
                    onClose();
                }
    
            } catch (error) {
                console.log(error);
            }

        } else {
            //! Gestion d'erreur (==> a factoriser ?)
            console.log('no token');
        }        
    }    

    return (
        <form className='form editProfileForm' method='post' onSubmit={editUserProfile}>
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
                    <label htmlFor="is_shared">Partager mon profil ?</label>
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
    )
}

export default EditProfileForm;  