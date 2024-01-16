import './Form.scss'

const AddSportForm = () => { 
    return (
        <form className='form addSportForm' method='post'>
            <div className="category">
                <label htmlFor="category"> Sélectionner une catégorie </label>
                <select name="category"> 
                    <option value="run"> Running </option>
                    <option value="crossfit"> Crossfit </option>
                </select>
            </div>
        </form>
    )
}

export default AddSportForm;  