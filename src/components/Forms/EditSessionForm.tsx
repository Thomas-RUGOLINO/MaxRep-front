import './Form.scss'
import Button from '../Button/Button';
import axiosInstance from '../../services/axiosInstance';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface EditSessionFormProps { 
    session:SessionProps,
    onProfileUpdate: () => void,
    userSports: UserSportsProps[],
}

interface SessionProps { 
    id:number,
    description:string,
    score:number,
    date:string,
    sport_id:number,
    sport:{
        name:string,
    }
}

interface UpdatedSessionProps {
    user_id:number | null,
    id:number,
    description:string,
    score:number,
    date:string,
    sport_id:number,
}

interface UserSportsProps {
    id: number,
    name: string,
}

const EditSessionForm = ({session, userSports, onProfileUpdate}: EditSessionFormProps) => { 

    const {token, userId } = useAuth()!; //Hook to get token and userId from AuthContext

    const [updatedSession, setUpdatedSession] = useState<UpdatedSessionProps>({
        user_id: userId,
        id: session.id,
        description: session.description,
        score: session.score,
        date: session.date,
        sport_id: session.sport_id,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { 
        e.preventDefault();
        console.log(e.target.value)

        setUpdatedSession({
            ...updatedSession,
            [e.target.name]: e.target.value
        })
    }

    const editSession = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();

        try {
            const response = await axiosInstance.post(`/sessions` , updatedSession, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                onProfileUpdate();
            }

        } catch (error) {
            //! Gestion d'erreur (==> a factoriser ?)
            console.error(error);
        }
    }

    return (
        <>
            <form className='form editSessionForm' method='post' onSubmit={editSession}>
                <div className="form__fields">
                    <div className="field">
                        <label htmlFor="date"> Date </label>
                        <input type="date" name='date' value={session.date} onChange={handleChange}/>
                    </div>
                    <div className="field">
                        <label htmlFor="text"> Activité </label>
                        <select name="text" value={session.sport_id} onChange={handleChange}>
                            {userSports.map((sport: UserSportsProps) => (
                                <option key={sport.id} value={sport.id}> {sport.name} </option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="description"> Description </label>
                        <textarea name='description' value={session.description} onChange={handleChange} />
                    </div>
                    <div className="field">
                        <label htmlFor="score"> Score </label>
                        <input type="number" name='score' value={session.score} onChange={handleChange} />
                    </div>
                </div>
                <div className="form__buttons">
                    <Button text='Editer' color='black' type='submit' />
                    <Button text='Supprimer' color='red' type='submit' />
                </div>
            </form>
        </>
    )
}

export default EditSessionForm;  