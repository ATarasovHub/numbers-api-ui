import { NumberProvider } from '../../utils/domain';

export const ProviderService = {
    fetchProviders: async (signal?: AbortSignal): Promise<NumberProvider[]> => {
        try {
            const res = await fetch(`http://localhost:8080/provider`, { signal, cache: 'no-store' });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data: NumberProvider[] = await res.json();
            return data;
        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                console.log('Fetch aborted.');
            } else {
                console.error("Failed to fetch providers:", error);
            }
            return [];
        }
    }
};