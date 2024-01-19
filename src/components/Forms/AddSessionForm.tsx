import './Form.scss'
import Button from '../Button/Button';

interface AddSessionFormProps { 
    onClose: () => void,
    onProfileUpdate: () => void,
    userSports: UserSportsProps[]
}

interface UserSportsProps {
    id: number,
    name: string,
}

const AddSessionForm = ({userSports, onClose, onProfileUpdate}: AddSessionFormProps) => { 


    //Get sports categories for form 

    const addSession = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();
    }

    return (
        <>
            <form className='form AddSessionForm' method='post' onSubmit={addSession}>
                {userSports.length === 0 ?
                     (<p> Vous n'avez pas encore ajouté de sport à votre profil. </p>) : (
                        <>
                            <div className="form__fields">
                                <div className="field">
                                    <label htmlFor="date"> Date de la session </label>
                                    <select name="date">
                                        <option value="14/01/2024"></option>
                                    </select>
                                </div>
                                <div className="field">
                                    <label htmlFor="text"> Activité à planifier </label>
                                    <select name="text">
                                        {userSports.map((sport: UserSportsProps) => (
                                            <option key={sport.id} value={sport.name}> {sport.name} </option>
                                        ))}

                                        
                                    </select>
                                </div>
                                <div className="field">
                                    <label htmlFor="text"> Description de la session </label>
                                    <select name="text">
                                        <option value="Marathon"></option>
                                    </select>
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