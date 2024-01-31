import './Form.scss'
import axios from 'axios';
import Button from '../Button/Button';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../Loader/Loader';

interface AddSportFormProps { 
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

const AddSportForm = ({onClose, onProfileUpdate}: AddSportFormProps) => { 

    const {token, userId } = useAuth()!;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [sportsCategories, setSportsCategories] = useState<SportsCategoriesProps[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(1);
    const [selectedSportId, setSelectedSportId] = useState<number | null>(1);

    //Get sports categories for form 
    const getSportsCategories = async () => {

        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const sortedCategories = response.data.sort((a: SportsCategoriesProps, b: SportsCategoriesProps) => a.id - b.id);
            setSportsCategories(sortedCategories);

        } catch (error) {
            if (axios.isAxiosError(error)) { //== Case if axios error
                if (error.response) {
                    setErrorMessage(error.response.data.error);

                } else { //== Case if no response from server
                    setErrorMessage('Erreur interne du serveur.');
                }

            } else { //== Case if not axios error
                setErrorMessage('Une erreur inattendue est survenue.');
            }

        } finally {
            setIsLoading(false);
        }
    }  

    //Set first category and sport as default values
    const updateSelectedCategoryAndSport = useCallback(() => {
        if (sportsCategories.length > 0) {
            const newSelectedCategoryId = sportsCategories[0].id;
            setSelectedCategoryId(newSelectedCategoryId);

            const newSports = sportsCategories[0].sports;
            if (newSports.length > 0) {
                setSelectedSportId(newSports[0].id);
            } else {
                setSelectedSportId(null);
            }
        }
    }, [sportsCategories]);

    //Get sports categories on component mount
    useEffect(() => {
        getSportsCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => { 
        updateSelectedCategoryAndSport();
    }, [updateSelectedCategoryAndSport]);


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
        setSelectedSportId(parseInt(e.target.value));
    }

    const addUserSport = async (e: { preventDefault: () => void; }) => { 
        e.preventDefault();

        try {
            setIsLoading(true);
            setErrorMessage('');
            
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/profile/sport/${userId}`, {sportId: selectedSportId} , {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            onProfileUpdate();
            onClose();
            return response.data

        } catch (error) {
            if (axios.isAxiosError(error)) { //== Case if axios error
                if (error.response) {
                    setErrorMessage(error.response.data.error);

                } else { //== Case if no response from server
                    setErrorMessage('Erreur interne du serveur.');
                }

            } else { //== Case if not axios error
                setErrorMessage('Une erreur inattendue est survenue.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && sportsCategories.length === 0 && <p> Aucune catégorie de sport n'a été trouvée </p>}
            {!isLoading && (
                <form className='form addSportForm' method='post' onSubmit={addUserSport}>
                    <div className="form__errors">
                        <p className='error-message'> {errorMessage} </p>
                    </div>
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