import './Form.scss'

const EditProfileForm = () => { 
    return (
        <form className='form editProfileForm' method='post'>
            <div className="lastname">
                <label htmlFor="lastname">Nom</label>
                <input type="text" name="lastname" required />
            </div>
            <div className="firstname">
                <label htmlFor="firstname">Prénom</label>
                <input type="text" name="firstname" required />
            </div>

            <div className="birthDate">
                <label htmlFor="birthDate">Date de naissance</label>
                <input type="date" name="birthDate" required />
            </div>
            <div className="gender">
                <label htmlFor="gender"> Sexe </label>
                <select name="gender">
                    <option value="Homme"> Homme </option>
                    <option value="Femme"> Femme </option>
                    <option value="Non binary"> Non binaire </option>
                </select>
            </div>
            <div className="city">
                <label htmlFor="city">Ville</label>
                <input type="text" name="city"/>
            </div>
            <div className="country">
                <label htmlFor="country">Pays</label>
                <input type="text" name="country"/>
            </div>
            <div className="height">
                <label htmlFor="height">Taille</label>
                <input type="number" name="height"/>
            </div>
            <div className="weight">
                <label htmlFor="weight">Poids</label>
                <input type="number" name="weight"/>
            </div>
        </form>
    )
}

export default EditProfileForm;  