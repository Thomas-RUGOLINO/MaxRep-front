export const formatDateInLetters = (value: Date) => {
    const dateObject = new Date(value);
    const year = dateObject.getFullYear();
    // Les mois commencent à partir de zéro car ils sont indexés dans un tableau
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); 
    const day = String(dateObject.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };


 //! Fonction 2 : formatage de la date pour la mettre sour la forme : <nom du jour> <jour> <mois> <année>
  export const formatDateToString = (inputDate: Date) => {
    const dateObject = new Date(inputDate);
  
    // Vérifiez si la date est valide avant de continuer
    if (!isNaN(dateObject.getTime())) {
      const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  
      const jourSemaine = jours[dateObject.getDay()];
      const jour = dateObject.getDate();
      const moisString = mois[dateObject.getMonth()];
      const annee = dateObject.getFullYear();
  
      return `${jourSemaine} ${jour} ${moisString} ${annee}`;
    } else {
      // Gérer le cas où la date n'est pas valide
      console.error("Date invalide");
      return "";
    }
  };