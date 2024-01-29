import './Calendar.scss';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface SessionProps {
    id: number;
    description: string;
    score: number;
    date: string;
    sport_id: number;
    sport: {
        name: string;
        unit: string;
    };
}

interface CalendarProps {
    sessions: SessionProps[];
    selectedDate: Date;
    onChange: (date: Date) => void;
}

const Calendar = ({sessions, selectedDate, onChange}: CalendarProps) => { 

    const tileClassName = ({ date, view }: { date: Date; view: string }) => {

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isToday = date.getTime() === today.getTime();

        const sessionDate = date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2, '0');
        const isSessionInDate = sessions.some(session => session.date === sessionDate);

        if (isToday && view === 'month') {
            return isSessionInDate ? 'session-active today' : 'today';
        } else {
            return isSessionInDate ? 'session-active' : null;
        }
    };

    return (
        <ReactCalendar
            onClickDay={onChange}
            value={selectedDate}
            tileClassName={tileClassName}
        />
    );
}

export default Calendar