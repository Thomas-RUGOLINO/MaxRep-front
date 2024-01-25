import './Form.scss'
import axiosInstance from '../../services/axiosInstance';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { convertSecondsToTime , convertTimeToSeconds } from '../../utils/convertTime';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';

interface EditSessionFormProps { 
    session:SessionProps,
    onProfileUpdate: () => void,
    onClose: () => void,
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
        unit:string
    }
}

interface UpdatedSessionProps {
    user_id:number | null,
    id:number,
    description:string,
    score:number,
    date:string,
    sport_id:number,
    unit:string,
}

interface UserSportsProps {
    id: number,
    name: string,
}

const EditSessionForm = ({session, userSports, onProfileUpdate, onClose}: EditSessionFormProps) => { 

    const {token, userId } = useAuth()!; //Hook to get token and userId from AuthContext

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [updatedSession, setUpdatedSession] = useState<UpdatedSessionProps>({
        user_id: userId,
        id: session.id,
        description: session.description,
        score: session.score,
        date: session.date,
        sport_id: session.sport_id,
        unit: session.sport.unit
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { 
        e.preventDefault();
        console.log(e.target.value)

        setUpdatedSession({
            ...updatedSession,
            [e.target.name]: e.target.name === 'score' ? parseInt(e.target.value) || 0 : e.target.value
        })
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, unit: 'hh' | 'mm' | 'ss') => { 
        const value = parseInt(e.target.value) || 0;
        const time = convertSecondsToTime(updatedSession.score);
        let totalSeconds = updatedSession.score;

        if (unit === 'hh') {
            totalSeconds = convertTimeToSeconds(value, time.minutes, time.secs);
        } else if (unit === 'mm') {
            totalSeconds = convertTimeToSeconds(time.hours, value, time.secs);
        } else if (unit === 'ss') {
            totalSeconds = convertTimeToSeconds(time.hours, time.minutes, value);
        }

        setUpdatedSession({
            ...updatedSession,
            score: totalSeconds
        });
    }

    const editSession = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();

        try {
            setIsLoading(true);
            console.log(updatedSession);
            const response = await axiosInstance.patch(`/sessions/${updatedSession.id}` , updatedSession, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
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

    const deleteSession = async () => { 

        try {
            setIsLoading(true);
            const response = await axiosInstance.delete(`/sessions/${updatedSession.id}` , {
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

        } finally {
            setIsLoading(false);
        }
    }

    const displayInputUnit = (unit: string) => {
        if (unit === 'temps') { 
            const { hours, minutes, secs } = convertSecondsToTime(updatedSession.score);

            return (
                <>
                    <input 
                        type="number" 
                        name='score-hh' 
                        className='input-time'
                        value={hours === 0 ? '' : hours}
                        onChange={(e) => handleTimeChange(e, 'hh')} 
                        max={24}
                        placeholder='hh' 
                    />
                    <input 
                        type="number" 
                        name='score-mm' 
                        className='input-time'
                        value={minutes === 0 ? '' : minutes} 
                        onChange={(e) => handleTimeChange(e, 'mm')} 
                        max={60}
                        placeholder='mm' 
                    />
                    <input 
                        type="number" 
                        name='score-ss' 
                        className='input-time'
                        value={secs === 0 ? '' : secs}
                        onChange={(e) => handleTimeChange(e, 'ss')} 
                        max={60}
                        placeholder='ss' 
                    />
                </>
            )
        } else {
            return (
                <input 
                    type="number" 
                    name='score' 
                    value={updatedSession.score === 0 ? '' : updatedSession.score} 
                    onChange={handleChange} 
                />
            )
        }
    }

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                <form className='form editSessionForm' method='post' onSubmit={editSession}>
                    <div className="form__fields">
                        <div className="field">
                            <label htmlFor="date"> Date </label>
                            <input type="date" name='date' value={updatedSession.date} onChange={handleChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="sport_id"> Activité </label>
                            <select disabled name="sport_id" value={updatedSession.sport_id}  onChange={handleChange} >
                                {userSports.map((sport: UserSportsProps) => (
                                    <option key={sport.id} value={sport.id}> {sport.name} </option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="description"> Description </label>
                            <textarea name='description' value={updatedSession.description}  onChange={handleChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="score"> Score </label>
                            {displayInputUnit(updatedSession.unit)}                                
                        </div>
                    </div>
                    <div className="form__buttons">
                        <Button text='Editer' color='black' type='submit' />
                        <Button text='Supprimer' color='red' type='button' onClick={deleteSession} />
                    </div>
                </form>
            )}
            
        </>
    )
}

export default EditSessionForm;  