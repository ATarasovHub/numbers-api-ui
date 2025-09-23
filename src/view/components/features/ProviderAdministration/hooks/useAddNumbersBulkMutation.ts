import { useState } from 'react';
import { providerApi } from '../../../../lib/api/providerApi';

interface UseAddNumbersBulkOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
}

export const useAddNumbersBulkMutation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = async (
        providerId: string,
        countryId: string,
        numbers: string[],
        smsEnabled: boolean,
        voiceEnabled: boolean,
        options?: UseAddNumbersBulkOptions
    ) => {
        setLoading(true);
        try {
            const data = await providerApi.addNumbersBulk(providerId, countryId, numbers, smsEnabled, voiceEnabled);
            if (options?.onSuccess) options.onSuccess(data);
            return data;
        } catch (err) {
            const e = err as Error;
            setError(e);
            if (options?.onError) options.onError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, loading, error };
};