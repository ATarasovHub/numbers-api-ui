import { useState } from 'react';
import { SearchParams } from '../components/SearchCustomerRequestForm/SearchCustomerRequestForm.types';

export const useSearchCustomerRequest = () => {
    const [searchParams, setSearchParams] = useState<SearchParams>({
        provisioningType: '',
        provider: '',
        bp: ''
    });

    const handleParamChange = (field: keyof SearchParams, value: string) => {
        setSearchParams(prev => ({ ...prev, [field]: value }));
    };

    const resetSearch = () => {
        setSearchParams({
            provisioningType: '',
            provider: '',
            bp: ''
        });
    };

    return {
        searchParams,
        handleParamChange,
        resetSearch
    };
};