import './Form.scss'
import axiosInstance from '../../services/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';

interface DeleteSportFormProps { 
    sportId: number | null,
    onClose: () => void,
    onProfileUpdate: () => void
}

const DeleteSportForm = ({sportId, onClose, onProfileUpdate}: DeleteSportFormProps) => { 

    const {token, userId } = useAuth()!; //Hook to get token and userId from AuthContext

    const deleteUserSport = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();  

        try {
            const response = await axiosInstance.delete(`/profile/sport/${userId}/${sportId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                onProfileUpdate();
                onClose();
            }

        } catch (error) {
            //! Gestion d'erreur (==> a factoriser ?)
            console.error(error);
        } 
    }

    return (
        <form className='form DeleteSportForm' method='post' onSubmit={deleteUserSport}>
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