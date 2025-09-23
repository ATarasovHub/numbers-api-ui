export function normalizeToArray(d: unknown): any[] {
    if (Array.isArray(d)) return d;
    if (d && typeof d === 'object') {
        const o = d as Record<string, unknown>;
        const keys = ['items', 'content', 'data', 'result', 'results', 'providers', 'countries'];
        for (const k of keys) {
            const v = (o as any)[k];
            if (Array.isArray(v)) return v;
        }
    }
    return [];
}