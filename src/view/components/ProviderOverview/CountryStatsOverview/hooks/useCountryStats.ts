import { useState } from 'react';
import { PhoneNumberData } from '../../../../types/providerTypes';

export const useCountryStats = () => {
    const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
    const [phoneNumbersData, setPhoneNumbersData] = useState<Record<string, PhoneNumberData[]>>({});
    const [loadingPhoneNumbers, setLoadingPhoneNumbers] = useState<Record<string, boolean>>({});

    const toggleCountryExpansion = async (countryId: string, countryName: string) => {
        const isCurrentlyExpanded = !!expandedCountries[countryId];
        setExpandedCountries(prev => ({ ...prev, [countryId]: !isCurrentlyExpanded }));

        if (!isCurrentlyExpanded && !phoneNumbersData[countryId]) {
            setLoadingPhoneNumbers(prev => ({ ...prev, [countryId]: true }));
            try {
                const response = await fetch(`http://localhost:8080/numbers/overview/country/${encodeURIComponent(countryName)}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const rawData = await response.json();
                const adaptedData: PhoneNumberData[] = rawData.map((item: any) => ({
                    number: item.number,
                    status: item.status || (!item.customerName && !item.techAccountName ? 'Free' : 'Active'),
                    customer: item.customerName,
                    techAccount: item.techAccountName,
                    endDate: item.endDate,
                    commentare: item.comment,
                    monthlyCost: item.monthlyCost,
                    assignedDate: item.startDate
                }));
                setPhoneNumbersData(prev => ({ ...prev, [countryId]: adaptedData }));
            } catch (error) {
                console.error(`Failed to fetch phone numbers for country ${countryName} (ID: ${countryId}):`, error);
                setPhoneNumbersData(prev => ({ ...prev, [countryId]: [] }));
            } finally {
                setLoadingPhoneNumbers(prev => ({ ...prev, [countryId]: false }));
            }
        }
    };

    return {
        expandedCountries,
        phoneNumbersData,
        loadingPhoneNumbers,
        toggleCountryExpansion,
    };
};