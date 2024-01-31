import './SessionScore.scss';
import axios from 'axios';
import {  useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { convertSecondsToTime , convertTimeToSeconds } from '../../utils/convertTime';
import Button from '../Button/Button';

interface SessionScoreProps { 
    session:SessionProps,
    isScore: boolean,
    onProfileUpdate: () => void,
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

const SessionScore = ({session, isScore, onProfileUpdate}: SessionScoreProps) => { 

    const {token, userId } = useAuth()!; //Hook to get token and userId from AuthContext

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [updatedSession, setUpdatedSession] = useState<UpdatedSessionProps>({
        user_id: userId,
        id: session.id,
        description: session.description,
        score: parseInt(String(session.score)),
        date: session.date,
        sport_id: session.sport_id,
        unit: session.sport.unit
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { 
        e.preventDefault();

        setUpdatedSession({
            ...updatedSession,
            score: parseInt(e.target.value) || 0
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
            score: totalSeconds || 0
        });
    }

    const editScore = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        setErrorMessage('');
        
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/sessions/${updatedSession.id}` , updatedSession, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            onProfileUpdate();
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
        }
    }
        
    //Handle input display according to sport unit
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
                        min={0}
                        max={24}
                        placeholder='hh' 
                    />
                    <input 
                        type="number" 
                        name='score-mm' 
                        className='input-time'
                        value={minutes === 0 ? '' : minutes} 
                        onChange={(e) => handleTimeChange(e, 'mm')} 
                        min={0}
                        max={60}
                        placeholder='mm' 
                    />
                    <input 
                        type="number" 
                        name='score-ss' 
                        className='input-time'
                        value={secs === 0 ? '' : secs}
                        onChange={(e) => handleTimeChange(e, 'ss')} 
                        min={0}
                        max={60}
                        placeholder='ss' 
                    />
                </>
                
            )
        } else {
            return (
                <input 
                    type='number' 
                    name='score' 
                    className='input' 
                    min={0}
                    placeholder={unit} 
                    value={updatedSession.score !== 0 ? updatedSession.score : ''}
                    onChange={handleChange}
                />
            )
        }
    }

    //Handle display of score or input
    const displayScoreInputOrValue = () => { 

        if (isScore) {
            if (session.sport.unit === 'temps') {
                const { hours, minutes, secs } = convertSecondsToTime(session.score);

                return (
                    <>
                        <p className="value"> {hours}h </p>
                        <p className="value"> {minutes}m </p>
                        <p className="value"> {secs}s </p>
                    </>
                );

            } else {
                return <p className="value"> {session.score} {session.sport.unit} </p>;
            }

        } else {
            return displayInputUnit(session.sport.unit);
        }
    }

    return (
        <div className="score" > 
            <form action="" onSubmit={editScore}>
                <label htmlFor='score'> Score: </label>
                {displayScoreInputOrValue()}
                {!isScore && <Button text='Ajouter' color='black' type='submit' isSmall />}
            </form>
            <div className="errors">
                <p className='errors__message'> {errorMessage} </p>
            </div>
        </div>
    )
}

export default SessionScore