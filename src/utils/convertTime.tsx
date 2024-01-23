export function convertSecondsToTime(seconds: number) { 
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours, minutes, secs };
}

export function convertTimeToSeconds(hours: number, minutes: number, seconds: number) { 
    return hours*3600 + minutes*60 + seconds;
}

export function convertSecondsToHMS(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const hours = h < 10 ? '0' + h : h;
    const minutes = m < 10 ? '0' + m : m;
    const secs = s < 10 ? '0' + s : s;

    return `${hours}:${minutes}:${secs}`;
}
