import './Form.scss'
import axiosInstance from '../../services/axiosInstance';
import Button from '../Button/Button';
import { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';

interface AddSportFormProps { 
    userId: number,
    onClose: () => void,
    onProfileUpdate: () => void
}

interface SportsCategoriesProps { 
    id: number,
    name: string,
    sports: SportsProps[]
}

interface SportsProps {
    id: number,
    name: string,
    category_id: number
}

const AddSportForm = ({userId, onClose, onProfileUpdate}: AddSportFormProps) => { 

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sportsCategories, setSportsCategories] = useState<SportsCategoriesProps[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number |null>(1);
    const [selectedSportId, setSelectedSportId] = useState<number | null>(1);

    useEffect(() => {
        getSportsCategories();
    }, [])

    //Get sports categories for form 
    const getSportsCategories = async () => {

        const token = localStorage.getItem('userToken');

        if (token) {

            try {
                setIsLoading(true);
                const response = await axiosInstance.get(`/categories`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log(response);
                if (response.status === 200) {
                    setSportsCategories(response.data);
                }
    
            } catch (error) {
                //! Gestion d'erreur (==> a factoriser ?)
                console.log(error);

            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            }
        }  

    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement> ) => {
        e.preventDefault();
        const categoryId = parseInt(e.target.value)
        setSelectedCategoryId(categoryId);

        //Set first sport of selected category as default value
        const firstSportInCategory = sportsCategories.find((category: SportsCategoriesProps) => category.id === categoryId)?.sports[0];
        if (firstSportInCategory) {
            setSelectedSportId(firstSportInCategory.id);
        } else {
            setSelectedSportId(null);
        }
    }

    const handleSportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => { 
        e.preventDefault();
        console.log(e.target.value);
        setSelectedSportId(parseInt(e.target.value));
    }

    const addUserSport = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();
        const token = localStorage.getItem('userToken');

        if (token) {

            try {
                const response = await axiosInstance.post(`/profile/sport/${userId}`, {sportId: selectedSportId} , {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log(response);
                if (response.status === 201) {
                    onProfileUpdate();
                    onClose();
                }
    
            } catch (error) {
                //! Gestion d'erreur (==> a factoriser ?)
                console.log(error);
            }
        }  
    }

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && sportsCategories.length === 0 && <p> Aucune catégorie de sport n'a été trouvée </p>}
            {!isLoading && (
                <form className='form addSportForm' method='post' onSubmit={addUserSport}>
                <div className="form__fields">
                    <div className="field">
                        <label htmlFor="category"> Sélectionner une catégorie </label>
                        <select name="category" onChange={handleCategoryChange}>
                            {sportsCategories.map((category: SportsCategoriesProps) => (
                                <option key={category.id} value={category.id}> {category.name} </option>
                            )
                            )}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="sport"> Sélectionner un sport </label>
                        <select name="sport" onChange={handleSportChange}>
                            {sportsCategories
                                .filter((category: SportsCategoriesProps) => category.id === selectedCategoryId)
                                .map((category: SportsCategoriesProps) => (
                                    category.sports.map((sport: SportsProps) => (
                                        <option key={sport.id} value={sport.id}> {sport.name} </option>
                                    ))
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="form__buttons">
                    <Button text='Ajouter' color='black' type='submit' />
                    <Button text='Annuler' color='red' onClick={onClose} type='button' />
                </div>
            </form>
            )}
        </>
    )
}

export default AddSportForm;  