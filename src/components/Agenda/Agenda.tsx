import './Agenda.scss';
import { formatDateToString } from '../../utils/formatDate';
import SessionScore from '../SessionScore/SessionScore';
import Button from '../Button/Button';

interface AgendaProps {
    selectedDate: Date;
    filteredSessions: SessionProps[];
    onOpenAddSessionModal: () => void;
    onOpenEditSessionModal: (session: SessionProps) => void;
    onProfileUpdate: () => void;
}

interface SessionProps {
    id:number,
    description:string,
    score:number,
    date:string,
    sport_id:number,
    sport:{
        name:string,
        unit:string
    }
}

const Agenda = ({selectedDate, filteredSessions, onOpenAddSessionModal, onOpenEditSessionModal, onProfileUpdate}: AgendaProps) => {


  return (
      <div className="agenda">
            <div className="agenda__spirals">
                <span className="spiral"></span>
                <span className="spiral"></span>
                <span className="spiral"></span>
                <span className="spiral"></span>
                <span className="spiral"></span>
                <span className="spiral"></span>
                <span className="spiral"></span>
                <span className="spiral"></span>
            </div>
            <div className="agenda__header">
                <h3> {formatDateToString(selectedDate)} </h3>
                <i className="fa-solid fa-circle-plus" title='Ajouter une session' onClick={onOpenAddSessionModal}></i>
            </div>
            <div className="agenda__sessions">
            {filteredSessions.length > 0 ? (
                filteredSessions.map((session: SessionProps) => (
                    <div key={session.id} className="session">
                        <i className="icon fa-solid fa-pen-to-square" title='Editer la session' onClick={() => onOpenEditSessionModal(session)}></i>
                        <p className='session__title'> <strong>Session de {session.sport.name}</strong> </p>
                        <p className='session__desc'> {session.description} </p>
                        <SessionScore 
                            session={session} 
                            isScore={parseInt(session.score.toString()) === 0 ? false : true}
                            onProfileUpdate={onProfileUpdate}    
                        />
                    </div>
                ))
                ) : (
                    <div className="no-sessions">
                        <p>Aucune session pour cette date.</p>
                        <Button 
                            text='Ajouter une session' 
                            color='black' 
                            onClick={onOpenAddSessionModal} 
                            isSmall
                            type='button'
                        />
                    </div>
                )}
                
            </div>
        </div>
  )
}

export default Agenda