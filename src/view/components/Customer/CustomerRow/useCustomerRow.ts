import { useState } from 'react';

interface UseCustomerRowProps {
    customerName: string;
    fetchAccountDetails: (customerName: string, techAccountId: number, pageNum: number, searchNumber?: string) => void;
}

export const useCustomerRow = ({
                                   customerName,
                                   fetchAccountDetails,
                               }: UseCustomerRowProps) => {
    const [localSearchQuery, setLocalSearchQuery] = useState<Record<number, string>>({});
    const [accountPages, setAccountPages] = useState<Record<number, number>>({});

    const handleSearchChange = (techAccountId: number, query: string) => {
        setLocalSearchQuery(prev => ({ ...prev, [techAccountId]: query }));
    };

    const handleSearchSubmit = (techAccountId: number) => {
        const query = localSearchQuery[techAccountId] || '';
        if (!query.trim()) return;

        setAccountPages(prev => ({ ...prev, [techAccountId]: 0 }));
        fetchAccountDetails(customerName, techAccountId, 0, query);
    };

    const handleSearchReset = (techAccountId: number) => {
        setLocalSearchQuery(prev => ({ ...prev, [techAccountId]: '' }));
        setAccountPages(prev => ({ ...prev, [techAccountId]: 0 }));
        fetchAccountDetails(customerName, techAccountId, 0);
    };

    const handleLoadMore = (techAccountId: number) => {
        const nextPage = (accountPages[techAccountId] || 0) + 1;
        setAccountPages(prev => ({ ...prev, [techAccountId]: nextPage }));
        fetchAccountDetails(customerName, techAccountId, nextPage);
    };

    return {
        localSearchQuery,
        accountPages,
        handleSearchChange,
        handleSearchSubmit,
        handleSearchReset,
        handleLoadMore,
    };
};