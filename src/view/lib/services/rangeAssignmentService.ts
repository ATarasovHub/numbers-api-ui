import { NumberOverview, CustomerData, TechAccountData } from '../../types/rangeAssignmentTypes';
import { rangeAssignmentApi } from '../api/rangeAssignmentApi';

export const rangeAssignmentService = {
    searchNumbers: async (payload: any, page: number, size?: number): Promise<NumberOverview[]> => {
        return rangeAssignmentApi.searchNumbers(payload, page, size);
    },

    searchAllNumbersForExport: async (payload: any): Promise<NumberOverview[] | null> => {
        return rangeAssignmentApi.searchAllNumbersForExport(payload);
    },

    searchCustomers: async (name: string, page: number, size?: number): Promise<{ content: CustomerData[], last: boolean }> => {
        return rangeAssignmentApi.searchCustomers(name, page, size);
    },

    searchTechAccounts: async (query: string, page: number, size?: number): Promise<{ content: TechAccountData[], last: boolean }> => {
        return rangeAssignmentApi.searchTechAccounts(query, page, size);
    },
};