import './Form.scss'
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { convertSecondsToTime , convertTimeToSeconds } from '../../utils/convertTime';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import DOMPurify from 'dompurify';

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
    const [errorMessage, setErrorMessage] = useState<string>('');
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

        //Sanitize input before setting state
        const sanitizedValue = DOMPurify.sanitize(e.target.value);
        setUpdatedSession({
            ...updatedSession,
            [e.target.name]: e.target.name === 'score' ? parseInt(sanitizedValue) || 0 : sanitizedValue
        })
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, unit: 'hh' | 'mm' | 'ss') => { 
        const value = parseInt(e.target.value) || 0;
        const time = convertSecondsToTime(updatedSession.score); //Get time from score and convert it to hours, minutes and seconds
        let totalSeconds = updatedSession.score; //Initialize totalSeconds with score in seconds

        //For each unit, convert time to seconds and update totalSeconds
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
            setErrorMessage('');
            
            const response = await axios.patch(`https://maxrep-back.onrender.com/api/sessions/${updatedSession.id}` , updatedSession, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            onProfileUpdate();
            onClose();
            return response.data

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

    const deleteSession = async () => { 

        try {
            setIsLoading(true);
            setErrorMessage('');

            const response = await axios.delete(`https://maxrep-back.onrender.com/api/sessions/${updatedSession.id}` , {
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

    //Display inputs for time or other unit (kg, reps, etc.)
    const displayInputUnit = (unit: string) => {
        if (unit === 'temps') { 
            const { hours, minutes, secs } = convertSecondsToTime(updatedSession.score); //Get time from score and convert it to hours, minutes and seconds

            return (
                <div className='inputs-time'>
                    <input 
                        type="number" 
                        name='score-hh' 
                        value={hours === 0 ? '' : hours}
                        onChange={(e) => handleTimeChange(e, 'hh')}
                        min={0} 
                        max={24}
                        placeholder='hh' 
                    />
                    <input 
                        type="number" 
                        name='score-mm' 
                        value={minutes === 0 ? '' : minutes} 
                        onChange={(e) => handleTimeChange(e, 'mm')} 
                        min={0}
                        max={60}
                        placeholder='mm' 
                    />
                    <input 
                        type="number" 
                        name='score-ss' 
                        value={secs === 0 ? '' : secs}
                        onChange={(e) => handleTimeChange(e, 'ss')} 
                        min={0}
                        max={60}
                        placeholder='ss' 
                    />
                </div>
            )
            
        } else {
            return (
                <input 
                    type="number" 
                    name='score' 
                    value={updatedSession.score === 0 ? '' : updatedSession.score} 
                    min={0}
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
                    <div className="form__errors">
                        <p className='error-message'> {errorMessage} </p>
                    </div>
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
                            <label htmlFor="score"> Score ({updatedSession.unit === 'temps' ? 'h:m:s' : updatedSession.unit}) </label>
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