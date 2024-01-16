import './Form.scss'

const AddSportForm = () => { 

    //! Prévoir liste des sports en fonction de la catégorie choisie
    return (
        <form className='form addSportForm' method='post'>
            <div className="field">
                <label htmlFor="category"> Sélectionner une catégorie </label>
                <select name="category"> 
                    <option value="run"> Running </option>
                    <option value="crossfit"> Crossfit </option>
                </select>
            </div>
            <div className="field">
                <label htmlFor="sport"> Sélectionner une catégorie </label>
                <select name="sport"> 
                    <option value="marathon"> Marathon </option>
                    <option value="100m"> 100m </option>
                </select>
            </div>
        </form>
    )
}

export default AddSportForm;  