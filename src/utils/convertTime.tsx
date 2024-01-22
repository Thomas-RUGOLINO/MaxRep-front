export function convertSecondsToTime(seconds: number) { 
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours, minutes, secs };
}

export function convertTimeToSeconds(hours: number, minutes: number, seconds: number) { 
    return hours*3600 + minutes*60 + seconds;
}