import './Form.scss'
import Button from '../Button/Button';

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

interface UserSportsProps {
    id: number,
    name: string,
}

const EditSessionForm = ({session, userSports, onProfileUpdate}: EditSessionFormProps) => { 


    //Get sports categories for form 

    const editSession = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();
    }

    const handleChange = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <form className='form editSessionForm' method='post' onSubmit={editSession}>
                <div className="form__fields">
                    <div className="field">
                        <label htmlFor="date"> Date </label>
                        <input type="date" name='date' value={session.date}/>
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
                        <input type="number" name='score' value={session.score} />
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