import './SessionScore.scss';
import Button from '../Button/Button';

interface SessionScoreProps { 
    session:SessionProps,
    isScore: boolean,
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

const SessionScore = ({session, isScore}: SessionScoreProps) => { 

    //Handle input display according to sport unit
    const displayInputUnit = (unit: string) => { 
        if (unit === 'km') {
            return (
                <input type="time" name='score' className='score__input' min="00:00" max="18:00" step={1} />
            )
        } else {
            return (
                <input type='number' name='score' className='score__input' placeholder={unit} />
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
                        <Button text='Ajouter' color='black' type='submit' isSmall />
                    </>
                )}
            </form>
        </div>
    )
}

export default SessionScore