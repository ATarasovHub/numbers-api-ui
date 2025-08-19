export type PageResponse<T> = { content: T[]; last: boolean }

export default function normalizePage<T>(data: any): { items: T[]; last: boolean } {
    if (Array.isArray(data)) return { items: data as T[], last: true }
    if (data && Array.isArray((data as PageResponse<T>).content)) {
        const page = data as PageResponse<T>
        return { items: page.content, last: Boolean((data as any).last) }
    }
    return { items: [], last: true }
}
