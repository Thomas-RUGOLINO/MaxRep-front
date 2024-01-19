import './Form.scss'
import Button from '../Button/Button';

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

const AddSessionForm = ({userSports, date, onClose, onProfileUpdate}: AddSessionFormProps) => { 


    //Get sports categories for form 

    const addSession = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();
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
                                    <input type="date" name='date' value={date}/>
                                </div>
                                <div className="field">
                                    <label htmlFor="text"> Activité</label>
                                    <select name="text">
                                        {userSports.map((sport: UserSportsProps) => (
                                            <option key={sport.id} value={sport.name}> {sport.name} </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field">
                                    <label htmlFor="description"> Description </label>
                                    <textarea name='description' />
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