import { Customer } from '../../types/customerOverviewTypes';
import { customerApi } from '../api/customerApi';

const ITEMS_PER_PAGE = 20;

export const customerService = {
    fetchCustomers: async (pageNum: number, filters: { customerName: string }) => {
        const data = await customerApi.fetchCustomers(pageNum, ITEMS_PER_PAGE, filters.customerName.trim());

        const normalized: Customer[] = data.content.map((c: any) => ({
            ...c,
            productType: c.productType ?? '-',
            proAccounts: c.proAccounts ?? [],
            proCountries: c.proCountries ?? [],
        }));

        return { content: normalized, last: data.last };
    },
};