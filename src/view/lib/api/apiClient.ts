const API_BASE_URL = 'http://localhost:8080';

export const apiClient = {
    get: async (url: string, params?: Record<string, string>) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        const response = await fetch(`${API_BASE_URL}${url}${queryString}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    },

    post: async (url: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    },

    put: async (url: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    },
};