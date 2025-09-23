export function normalizeNumber(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return '';
    let s = trimmed.replace(/[^\d+]/g, '');
    if (s.startsWith('00')) s = '+' + s.slice(2);
    if (!s.startsWith('+') && /^\d+$/.test(s)) s = '+' + s;
    return s;
}

export function isValidE164(num: string): boolean {
    return /^\+[1-9]\d{6,14}$/.test(num);
}

export function tokenize(text: string): string[] {
    return text.split(/[\s,;|\n\r\t]+/).map(t => t.trim()).filter(Boolean);
}