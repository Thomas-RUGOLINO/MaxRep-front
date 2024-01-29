import './ChartDesktop.scss';
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, Legend} from 'chart.js';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { convertSecondsToHMS } from '../../utils/convertTime';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend
);

interface ChartDesktopProps {
    sport:SportProps
}

interface SportProps {
    id:number,
    name:string,
    unit:string,
    sessions:SessionProps[]
}

interface SessionProps { 
    id:number,
    date:string,
    description:string,
    score:number,
    sport_id:number,
}

const ChartDesktop = ({sport}: ChartDesktopProps) => { 

    const [redraw, setRedraw] = useState(false);

    const prepareChartData = (sport: SportProps) => {
        const sortedSessions = sport.sessions.sort((a: SessionProps, b: SessionProps) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const dataPoints = sortedSessions.map(session => ({
            x: new Date(session.date), // Convertir en objet Date
            y: session.score
        }));
    
        return {
            label: '',
            data: dataPoints,
            fill: false,
            borderColor: '#E73725',
            backgroundColor: '#E1E1E1',
        };
    };

    //Handle window resize and redraw chart to get responsive chart
    useEffect(() => {
        const handleResize = () => {
            setRedraw(true);
            setTimeout(() => setRedraw(false), 0);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: 'day' as const,
                    displayFormats: {
                        day: 'd MMM' as const
                    }
                },
                title: {
                    display: true,
                    text: 'Date' as const
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Score (kg)'
                },
            },
        } , 
        plugins: {
            legend: {
                display: false
            },
        },
        
    };

    const chartOptionsTime = {
        responsive: true,
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: 'day' as const,
                    displayFormats: {
                        day: 'd MMM' as const
                    }
                },
                title: {
                    display: true,
                    text: 'Date' as const
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Score (temps)'
                },
                ticks: {
                    callback: function(value: number) {
                        return convertSecondsToHMS(value)
                    }
                }
            },
        }, 
        plugins: {
            legend: {
                display: false
            },
        },
    };

    return (
        <div className="chart-container">
            <Line 
                data={{ datasets: [prepareChartData(sport)] }} 
                options={sport.unit === 'temps' ? chartOptionsTime : chartOptions}
                redraw={redraw}
            />
        </div>

    )
}

export default ChartDesktop;