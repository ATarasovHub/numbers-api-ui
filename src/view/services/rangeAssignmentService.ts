import { NumberOverview, CustomerData, TechAccountData } from '../types/rangeAssignmentTypes';

export class RangeAssignmentService {
    static async searchNumbers(filterPayload: any, page: number, size: number = 20): Promise<NumberOverview[]> {
        try {
            const response = await fetch(`http://localhost:8080/numbers/overview/search?page=${page}&size=${size}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filterPayload),
            });

            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            console.error('Error fetching numbers:', error);
            return [];
        }
    }

    static async searchAllNumbersForExport(filterPayload: any): Promise<NumberOverview[] | null> {
        try {
            const response = await fetch(`http://localhost:8080/numbers/overview/searchP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filterPayload),
            });

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Error loading all data for export:', error);
            return null;
        }
    }

    static async searchCustomers(name: string, page: number, size: number = 10): Promise<{ content: CustomerData[], last: boolean }> {
        try {
            const response = await fetch(`http://localhost:8080/customer/overview/search?name=${encodeURIComponent(name)}&page=${page}&size=${size}`);

            if (response.ok) {
                const data = await response.json();
                return {
                    content: Array.isArray(data.content) ? data.content : [],
                    last: data.last ?? true
                };
            }
            return { content: [], last: true };
        } catch (error) {
            console.error('Error fetching customers:', error);
            return { content: [], last: true };
        }
    }

    static async searchTechAccounts(query: string, page: number, size: number = 10): Promise<{ content: TechAccountData[], last: boolean }> {
        try {
            const response = await fetch(`http://localhost:8080/accounts/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);

            if (response.ok) {
                const data = await response.json();
                return {
                    content: Array.isArray(data.content) ? data.content : [],
                    last: data.last ?? true
                };
            }
            return { content: [], last: true };
        } catch (error) {
            console.error('Error fetching tech accounts:', error);
            return { content: [], last: true };
        }
    }
}