import { apiClient } from './apiClient';

export const customerApi = {
    fetchCustomers: async (page: number, size: number, name?: string) => {
        const params: Record<string, string> = {
            page: page.toString(),
            size: size.toString(),
        };
        if (name) params.customerName = name;
        return apiClient.get('/customer/overview', params);
    },
};