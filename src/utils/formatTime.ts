// Small helper to render a Date as a friendly "time ago" string,
// used for the "Last updated" labels on the Devices and Sensors screens.

export function formatTimeAgo(date: Date | null): string {
    if (!date) {
        return '';
    }

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 10) {
        return 'Just now';
    }

    if (seconds < 60) {
        return `${seconds}s ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    }

    const hours = Math.floor(minutes / 60);

    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
}
