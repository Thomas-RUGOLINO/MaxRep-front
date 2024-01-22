import './SessionScore.scss';
import axiosInstance from '../../services/axiosInstance';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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

function convertSecondsToTime(seconds: number) { 
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours, minutes, secs };
}

function convertTimeToSeconds(hours: number, minutes: number, seconds: number) { 
    return hours*3600 + minutes*60 + seconds;
}

const SessionScore = ({session, isScore, onProfileUpdate}: SessionScoreProps) => { 

    const {token, userId } = useAuth()!; //Hook to get token and userId from AuthContext

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
            score: totalSeconds
        });
    }

    const editScore = async () => { 

            try {
                const response = await axiosInstance.patch(`/sessions/${updatedSession.id}` , updatedSession, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (response.status === 200) {
                    onProfileUpdate();
                }
    
            } catch (error) {
                //! Gestion d'erreur (==> a factoriser ?)
                console.error(error);
    
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
                        value={hours}
                        onChange={(e) => handleTimeChange(e, 'hh')} 
                        max={24}
                        placeholder='hh' 
                    />
                    <input 
                        type="number" 
                        name='score-mm' 
                        className='input-time'
                        value={minutes} 
                        onChange={(e) => handleTimeChange(e, 'mm')} 
                        max={60}
                        placeholder='mm' 
                    />
                    <input 
                        type="number" 
                        name='score-ss' 
                        className='input-time'
                        value={secs}
                        onChange={(e) => handleTimeChange(e, 'ss')} 
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
                    min='0'
                    placeholder={unit} 
                    value={updatedSession.score}
                    onChange={handleChange}
                />
            )
        }
    }

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
        </div>
        
    )
}

export default SessionScore