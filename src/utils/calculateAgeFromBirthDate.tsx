const calculateAgeFromBirthDate = (birthDate: string) => {
    //Decompose birthDate string to get year, month and day
    const birthDateArray = birthDate.split('-');
    const birthDateYear = parseInt(birthDateArray[0]);
    const birthDateMonth = parseInt(birthDateArray[1]);
    const birthDateDay = parseInt(birthDateArray[2]);

    //Calculate age
    const today = new Date();
    const age = today.getFullYear() - birthDateYear;
    const month = today.getMonth() - birthDateMonth;
    const day = today.getDate() - birthDateDay;

    if (month < 0 || (month === 0 && day < 0)) {
        return age - 1;
    } else {
        return age;
    }
}

export default calculateAgeFromBirthDate;