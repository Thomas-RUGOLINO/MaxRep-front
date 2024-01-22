import './Form.scss'
import axiosInstance from '../../services/axiosInstance';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';

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

    const {token, userId } = useAuth()!; //Hook to get token and userId from AuthContext

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [newSession, setNewSession] = useState<NewSessionProps>({
        user_id: userId,
        date: date,
        sport_id: userSports[0].id,
        description: '',
        score: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { 
        e.preventDefault();
        console.log(e.target.value)

        setNewSession({
            ...newSession,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        console.log(newSession);
    },[newSession])

    const addSession = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await axiosInstance.post(`/sessions` , newSession, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data);

            if (response.status === 201) {
                onProfileUpdate();
                onClose();
            }

        } catch (error) {
            //! Gestion d'erreur (==> a factoriser ?)
            console.error(error);

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