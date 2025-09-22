import { Customer } from '../types/customerOverviewTypes';

const ITEMS_PER_PAGE = 20;

export const CustomerService = {
    fetchCustomers: async (pageNum: number, filters: { customerName: string }): Promise<{ content: Customer[], last: boolean }> => {
        const params = new URLSearchParams({
            page: pageNum.toString(),
            size: ITEMS_PER_PAGE.toString()
        });

        if (filters.customerName.trim()) {
            params.append('customerName', filters.customerName.trim());
        }

        try {
            const response = await fetch(`http://localhost:8080/customer/overview?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const normalized: Customer[] = data.content.map((c: any) => ({
                ...c,
                productType: c.productType ?? '-',
                proAccounts: c.proAccounts ?? [],
                proCountries: c.proCountries ?? []
            }));

            return { content: normalized, last: data.last };
        } catch (error) {
            console.error("Failed to fetch customers:", error);
            throw error;
        }
    }
};