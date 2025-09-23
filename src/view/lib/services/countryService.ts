import { PhoneNumberData } from '../../types/providerTypes';
import { countryApi } from '../api/countryApi';

export const countryService = {
    fetchPhoneNumbersByCountry: async (countryName: string): Promise<PhoneNumberData[]> => {
        const rawData = await countryApi.fetchPhoneNumbersByCountry(countryName);
        return rawData.map((item: any) => ({
            number: item.number,
            status: item.status || (!item.customerName && !item.techAccountName ? 'Free' : 'Active'),
            customer: item.customerName,
            techAccount: item.techAccountName,
            endDate: item.endDate,
            commentare: item.comment,
            monthlyCost: item.monthlyCost,
            assignedDate: item.startDate,
        }));
    },
};