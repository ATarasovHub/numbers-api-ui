import { apiClient } from './apiClient';

export const providerApi = {
    fetchProviders: async () => {
        return apiClient.get('/provider');
    },

    addNumbersBulk: async (
        providerId: string,
        countryId: string,
        numbers: string[],
        smsEnabled: boolean,
        voiceEnabled: boolean
    ) => {
        return apiClient.post(
            `/provider/${providerId}/numbers-bulk?countryId=${encodeURIComponent(countryId)}`,
            { numbers, smsEnabled, voiceEnabled }
        );
    },
};