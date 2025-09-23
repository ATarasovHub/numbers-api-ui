import { apiClient } from './apiClient';

export const rangeAssignmentApi = {
    searchNumbers: async (payload: any, page: number, size = 20) => {
        return apiClient.post(`/numbers/overview/search?page=${page}&size=${size}`, payload);
    },

    searchAllNumbersForExport: async (payload: any) => {
        return apiClient.post('/numbers/overview/searchP', payload);
    },

    searchCustomers: async (name: string, page: number, size = 10) => {
        return apiClient.get('/customer/overview/search', {
            name,
            page: page.toString(),
            size: size.toString(),
        });
    },

    searchTechAccounts: async (query: string, page: number, size = 10) => {
        return apiClient.get('/accounts/search', {
            query,
            page: page.toString(),
            size: size.toString(),
        });
    },
};