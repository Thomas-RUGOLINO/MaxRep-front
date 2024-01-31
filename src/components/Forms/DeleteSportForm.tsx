import './Form.scss'
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';

interface DeleteSportFormProps { 
    sportId: number | null,
    onClose: () => void,
    onProfileUpdate: () => void
}

const DeleteSportForm = ({sportId, onClose, onProfileUpdate}: DeleteSportFormProps) => { 

    const {token, userId } = useAuth()!; //Hook to get token and userId from AuthContext

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deleteUserSport = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();  

        try {
            setIsLoading(true);
            setErrorMessage('');
            
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/profile/sport/${userId}/${sportId}`, {
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
                <form className='form DeleteSportForm' method='post' onSubmit={deleteUserSport}>
                    <div className="form__errors">
                        <p className='error-message'> {errorMessage} </p>
                    </div>
                    <div className="form__fields">
                        <p style={{textAlign: 'center'}}> Êtes-vous sur de vouloir supprimer ce sport ? </p>
                    </div>
                    <div className="form__buttons">
                        <Button text='Valider' color='black' type='submit' />
                        <Button text='Annuler' color='red' onClick={onClose} type='button' />
                    </div>
                </form>
            )}
            
        </>
        
    )
}

export default DeleteSportForm;  