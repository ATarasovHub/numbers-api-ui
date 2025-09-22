export function debounce<A extends any[], R>(
    func: (...args: A) => R,
    wait: number
) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: A): void => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), wait);
    };
}