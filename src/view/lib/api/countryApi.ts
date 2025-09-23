import { apiClient } from './apiClient';

export const countryApi = {
    fetchPhoneNumbersByCountry: async (countryName: string): Promise<any[]> => {
        return apiClient.get(`/numbers/overview/country/${encodeURIComponent(countryName)}`);
    },
};