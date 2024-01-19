import './Form.scss'
import Button from '../Button/Button';
import axiosInstance from '../../services/axiosInstance';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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
    userId: number | null,
    date: string,
    sport_id: number,
    description: string,
}

const AddSessionForm = ({userSports, date, onClose, onProfileUpdate}: AddSessionFormProps) => { 

    const {token, userId } = useAuth()!; //Hook to get token and userId from AuthContext

    const [newSession, setNewSession] = useState<NewSessionProps>({
        userId: userId,
        date: date,
        sport_id: userSports[0].id,
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { 
        e.preventDefault();
        console.log(e.target.value)

        setNewSession({
            ...newSession,
            [e.target.name]: e.target.value
        })
    }

    const addSession = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();

        try {
            const response = await axiosInstance.post(`/sessions` , newSession, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                onProfileUpdate();
                onClose();
            }

        } catch (error) {
            //! Gestion d'erreur (==> a factoriser ?)
            console.error(error);
        }
    }

    return (
        <>
            <form className='form addSessionForm' method='post' onSubmit={addSession}>
                {userSports.length === 0 ?
                     (<p> Vous n'avez pas encore ajouté de sport à votre profil. </p>) : (
                        <>
                            <div className="form__fields">
                                <div className="field">
                                    <label htmlFor="date"> Date </label>
                                    <input type="date" name='date' value={date} onChange={handleChange}/>
                                </div>
                                <div className="field">
                                    <label htmlFor="text"> Activité</label>
                                    <select name="text" onChange={handleChange}>
                                        {userSports.map((sport: UserSportsProps) => (
                                            <option key={sport.id} value={sport.name}> {sport.name} </option>
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
        </>
    )
}

export default AddSessionForm;  