import { useState, useCallback } from 'react';
import { PhoneNumberData } from '../../../../../types/providerTypes';
import { CountryService } from '../../../../../lib/api/countryService';

export const useCountryStats = () => {
    const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
    const [phoneNumbersData, setPhoneNumbersData] = useState<Record<string, PhoneNumberData[]>>({});
    const [loadingPhoneNumbers, setLoadingPhoneNumbers] = useState<Record<string, boolean>>({});

    const toggleCountryExpansion = useCallback(async (countryId: string, countryName: string) => {
        const isCurrentlyExpanded = !!expandedCountries[countryId];
        setExpandedCountries(prev => ({ ...prev, [countryId]: !isCurrentlyExpanded }));

        if (!isCurrentlyExpanded && !phoneNumbersData[countryId]) {
            setLoadingPhoneNumbers(prev => ({ ...prev, [countryId]: true }));
            try {
                const data = await CountryService.fetchPhoneNumbersByCountry(countryName);
                setPhoneNumbersData(prev => ({ ...prev, [countryId]: data }));
            } catch (error) {
                setPhoneNumbersData(prev => ({ ...prev, [countryId]: [] }));
            } finally {
                setLoadingPhoneNumbers(prev => ({ ...prev, [countryId]: false }));
            }
        }
    }, [expandedCountries, phoneNumbersData]);

    return {
        expandedCountries,
        phoneNumbersData,
        loadingPhoneNumbers,
        toggleCountryExpansion,
    };
};