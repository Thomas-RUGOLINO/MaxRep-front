import './Form.scss'
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import DOMPurify from 'dompurify';

interface AddSessionFormProps { 
    onClose: () => void,
    onProfileUpdate: () => void,
    userSports: UserSportsProps[],
    date: string
}

interface UserSportsProps {
    id: number,
    name: string,
}

interface NewSessionProps { 
    user_id: number | null,
    date: string,
    sport_id: number,
    description: string,
    score: number,
}


const AddSessionForm = ({userSports, date, onClose, onProfileUpdate}: AddSessionFormProps) => { 

    const {token, userId } = useAuth()!; 

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [newSession, setNewSession] = useState<NewSessionProps>({
        user_id: userId,
        date: date,
        sport_id: userSports[0].id,
        description: '',
        score: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { 
        e.preventDefault();

        //Sanitize input before setting state
        const sanitizedValue = DOMPurify.sanitize(e.target.value);
        setNewSession({
            ...newSession,
            [e.target.name]: sanitizedValue
        })
    }

    const addSession = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();

        try {
            setIsLoading(true);
            setErrorMessage('');
            
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/sessions` , newSession, {
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

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                <form className='form addSessionForm' method='post' onSubmit={addSession}>
                {userSports.length === 0 ?
                     (<p> Vous n'avez pas encore ajouté de sport à votre profil. </p>) : (
                        <>
                            <div className="form__errors">
                                <p className='error-message'> {errorMessage} </p>
                            </div>
                            <div className="form__fields">
                                <div className="field">
                                    <label htmlFor="date"> Date </label>
                                    <input type="date" name='date' value={newSession.date} onChange={handleChange}/>
                                </div>
                                <div className="field">
                                    <label htmlFor="sport_id"> Activité</label>
                                    <select name="sport_id" onChange={handleChange}>
                                        {userSports.map((sport: UserSportsProps) => (
                                            <option key={sport.id} value={sport.id}> {sport.name} </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field">
                                    <label htmlFor="description"> Description </label>
                                    <textarea name='description' onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form__buttons">
                                <Button text='Ajouter' color='black' type='submit' />
                                <Button text='Annuler' color='red' onClick={onClose} type='button' />
                            </div>
                        </>
                     )}
                </form>
            )}
            
        </>
    )
}

export default AddSessionForm;  