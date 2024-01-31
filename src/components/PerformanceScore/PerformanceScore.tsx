import './PerformanceScore.scss';
import { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { convertSecondsToTime, convertTimeToSeconds } from '../../utils/convertTime';

interface PerformanceScoreProps { 
    selectedSport:SportProps,
    sportIndex:number,
    getUserPerformances:(index:number) => void
}

interface SportProps {
    id:number,
    name:string,
    unit:string,
    sessions:SessionProps[]
}

interface SessionProps {
    id:number,
    date:string,
    description:string,
    score:number,
    user_id:number,
    sport_id:number,
}

interface sessionToModifyProps {
    date:string,
    score:number,
    user_id:number,
    sport_id:number,
}

const PerformanceScore = ({selectedSport, sportIndex, getUserPerformances}: PerformanceScoreProps) => { 

    const { token, userId } = useAuth()!; //Hook to get token and userId from AuthContext if user is authenticated

    const [sessionToModify, setSessionToModify] = useState<sessionToModifyProps>({
        date: '',
        score: 0,
        user_id: userId as number,
        sport_id: selectedSport.id
    }); 

    // Set sport_id in sessionToModify when selectedSport changes
    useEffect(() => {
        setSessionToModify((prevSessionToModify) => ({
            ...prevSessionToModify,
            sport_id: selectedSport.id,
        }));

    }, [selectedSport]);

    // Handle change in inputs with basic unit
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        // Sessions inputs that can be modified are date and score
        setSessionToModify({
            ...sessionToModify,
            [e.target.name]: e.target.name === 'score' ? parseInt(e.target.value) || 0 : e.target.value
        });
    }

    // Handle change in inputs with time unit
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, unit: 'hh' | 'mm' | 'ss') => { 
        const value = parseInt(e.target.value) || 0;
        const time = convertSecondsToTime(sessionToModify.score);
        let totalSeconds = sessionToModify.score;

        if (unit === 'hh') {
            totalSeconds = convertTimeToSeconds(value, time.minutes, time.secs);
        } else if (unit === 'mm') {
            totalSeconds = convertTimeToSeconds(time.hours, value, time.secs);
        } else if (unit === 'ss') {
            totalSeconds = convertTimeToSeconds(time.hours, time.minutes, value);
        }

        setSessionToModify({
            ...sessionToModify,
            score: totalSeconds || 0
        });
    }

    const addScoreOrUpdate = async (e:React.FormEvent<HTMLFormElement>, sportIndex:number) => {
        e.preventDefault();
        
        // Filter sessions to get the one that matches the date and sport_id
        const filteredResponse = selectedSport.sessions.filter((session:SessionProps) => session.sport_id === selectedSport.id && session.user_id === userId && session.date === sessionToModify.date);
        
        // If there is one session => update session
        if (filteredResponse.length > 0) {
            
            const sessionToUpdate = await axios.patch(`https://maxrep-back.onrender.com/api/sessions/${filteredResponse[0].id}`, sessionToModify, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            getUserPerformances(sportIndex); // Get user performances to update chart of the selected sport

            // Reset sessionToModify
            setSessionToModify({
                date: '',
                score: 0,
                user_id: userId as number,
                sport_id: selectedSport.id
            });

            return sessionToUpdate.data
        
        // Else => create session
        } else {
            const sessionToCreate = await axios.post(`https://maxrep-back.onrender.com/api/sessions`, sessionToModify, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            getUserPerformances(sportIndex); // Get user performances to update chart of the selected sport
            return sessionToCreate.data
        }
    }
    
    // Display input with basic unit or time unit
    const displayInputUnit = (unit: string) => { 
        if (unit === 'temps') {
            const { hours, minutes, secs } = convertSecondsToTime(sessionToModify.score);

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
                    value={sessionToModify.score !== 0 ? sessionToModify.score : ''}
                    onChange={handleChange}
                />
            )
        }
    }

    return (
        <>
            <form action="" onSubmit={(e) => addScoreOrUpdate(e, sportIndex)}>
                <label htmlFor="">Date</label>
                <input 
                type="date" 
                name="date" 
                id="" 
                onChange={handleChange}
                required />
                <label htmlFor="">Score</label>
                {displayInputUnit(selectedSport.unit)}
                <Button text='Ajouter' color='black' type='submit' isSmall/>
            </form>
        </>
    )
}

export default PerformanceScore