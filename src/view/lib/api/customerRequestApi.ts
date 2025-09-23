import { apiClient } from './apiClient';
import { CustomerRequestPayload } from '../../components/features/CustomerRequestOverview/CreateCustomerRequestForm/CreateCustomerRequestForm.types';

export const customerRequestApi = {
    createCustomerRequest: async (payload: CustomerRequestPayload) => {
        return apiClient.post('/customer-request', payload);
    },

    getCustomerRequests: async (params?: Record<string, string>) => {
        return apiClient.get('/customer-request', params);
    },
};