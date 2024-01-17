import './Form.scss'
import axiosInstance from '../../services/axiosInstance';
import Button from '../Button/Button';

interface DeleteSportFormProps { 
    userId: number,
    sportId: number | null,
    onClose: () => void,
    onProfileUpdate: () => void
}

const DeleteSportForm = ({userId, sportId, onClose, onProfileUpdate}: DeleteSportFormProps) => { 

    const deleteUserSport = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();  
        
        const token = localStorage.getItem('userToken');

        if (token) {
            console.log('submit delete sport :', userId, sportId);

            try {
                const response = await axiosInstance.delete(`/profile/sport/${userId}/${sportId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log(response);
                if (response.status === 204) {
                    onProfileUpdate();
                    onClose();
                }
    
            } catch (error) {
                //! Gestion d'erreur (==> a factoriser ?)
                console.log(error);
            }
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