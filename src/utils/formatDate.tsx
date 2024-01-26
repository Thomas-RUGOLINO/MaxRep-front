export const formatDateInLetters = (value: Date) => {
    const dateObject = new Date(value);
    const year = dateObject.getFullYear();
    // Les mois commencent à partir de zéro car ils sont indexés dans un tableau
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); 
    const day = String(dateObject.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };


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

  export const convertDateFormatToEu = (inputDate : Date) => {
  
    // Créer un objet Date en utilisant la date d'entrée
    const dateObject = new Date(inputDate);
    if(!isNaN(dateObject.getTime())) {
    // Extraire le jour, le mois et l'année de l'objet Date
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0, donc ajouter 1
    const year = dateObject.getFullYear();
  
    // Assembler la date au format "DD/MM/YYYY"
    const formattedDate = `${day}/${month}/${year}`;
  
    return formattedDate;
  }else {
    // Gérer le cas où la date n'est pas valide
    console.error("Date invalide");
    return ""
  }
  }