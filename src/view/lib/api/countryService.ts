import { PhoneNumberData } from '../../types/providerTypes';

export const CountryService = {
    fetchPhoneNumbersByCountry: async (countryName: string): Promise<PhoneNumberData[]> => {
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
            return adaptedData;
        } catch (error) {
            console.error(`Failed to fetch phone numbers for country ${countryName}:`, error);
            throw error;
        }
    }
};