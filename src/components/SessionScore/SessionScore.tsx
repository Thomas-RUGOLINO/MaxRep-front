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
    score:number | '', //Score can be empty if user has not yet entered a score
    date:string,
    sport_id:number,
    unit:string,
}

const SessionScore = ({session, isScore, onProfileUpdate}: SessionScoreProps) => { 

    const {token, userId } = useAuth()!; //Hook to get token and userId from AuthContext
    const [updatedSession, setUpdatedSession] = useState<UpdatedSessionProps>({
        user_id: userId,
        id: session.id,
        description: session.description,
        score: '',
        date: session.date,
        sport_id: session.sport_id,
        unit: session.sport.unit
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { 
        e.preventDefault();
        console.log(e.target.value)

        setUpdatedSession({
            ...updatedSession,
            score: parseInt(e.target.value)
        })
    }

    const editScore = async () => { 

        if (updatedSession.score !== '') { 
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
    }
        
    //Handle input display according to sport unit
    const displayInputUnit = (unit: string) => { 
        if (unit === 'km') {
            return (
                <input 
                    type="time" 
                    name='score' 
                    className='score__input' 
                    min="00:00:00" 
                    max="24:00:00" 
                    step={1} 
                    value={updatedSession.score}
                    placeholder='hh:mm:ss'
                    onChange={handleChange}
                />
            )
        } else {
            return (
                <input 
                    type='number' 
                    name='score' 
                    className='score__input' 
                    min='0'
                    placeholder={unit} 
                    value={updatedSession.score}
                    onChange={handleChange}
                />
            )
        }
    }

    return (
        <div className="session__score"> 
            <form action="">
                <label htmlFor='score'> Score : </label>
                {isScore ? (
                    <p className="score__value"> {session.score} {session.sport.unit} </p>
                ) : (
                    <>
                        {displayInputUnit(session.sport.unit)}
                        <Button text='Ajouter' color='black' type='submit' isSmall onClick={editScore} />
                    </>
                )}
            </form>
        </div>
        
    )
}

export default SessionScore