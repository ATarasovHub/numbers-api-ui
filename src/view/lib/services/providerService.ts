import { NumberProvider } from '../../../utils/domain';
import { providerApi } from '../api/providerApi';

export const providerService = {
    fetchProviders: async (signal: AbortSignal): Promise<NumberProvider[]> => {
        try {
            return await providerApi.fetchProviders();
        } catch (error) {
            console.error("Failed to fetch providers:", error);
            return [];
        }
    },
};