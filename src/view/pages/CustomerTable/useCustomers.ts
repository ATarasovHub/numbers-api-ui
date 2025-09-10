// useCustomers.ts
import { useState, useCallback, useEffect } from 'react';
import { Customer, CustomerOverviewProAccount, TechAccountDetails } from './types';

const ITEMS_PER_PAGE = 20;

export interface FilterState {
    customerName: string;
    totalNumbers: string;
    totalNumbersOp: '>=' | '<=' | '=';
}

function debounce<A extends any[], R>(
    func: (...args: A) => R,
    wait: number
) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: A): void => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), wait);
    };
}

export const useCustomers = () => {
    const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
    const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        customerName: '',
        totalNumbers: '',
        totalNumbersOp: '>='
    });
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const fetchCustomers = useCallback((pageNum: number, resetData = false) => {
        if (loading) return;
        setLoading(true);

        const params = new URLSearchParams({
            page: pageNum.toString(),
            size: ITEMS_PER_PAGE.toString()
        });

        if (filters.customerName.trim()) {
            params.append('customerName', filters.customerName.trim());
        }
        if (filters.totalNumbers.trim() && !isNaN(Number(filters.totalNumbers))) {
            params.append('totalNumbers', filters.totalNumbers.trim());
            params.append('totalNumbersOp', filters.totalNumbersOp);
        }

        fetch(`http://localhost:8080/customer/overview?${params.toString()}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: any) => {
                const normalized: Customer[] = data.content.map((c: any) => ({
                    ...c,
                    productType: c.productType ?? '-',
                    proAccounts: c.proAccounts ?? [],
                    proCountries: c.proCountries ?? []
                }));

                if (pageNum === 0 || resetData) {
                    setAllCustomers(normalized);
                    setDisplayedCustomers(normalized);
                } else {
                    setAllCustomers(prev => [...prev, ...normalized]);
                    setDisplayedCustomers(prev => [...prev, ...normalized]);
                }

                setHasMore(!data.last);
                setPage(pageNum);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch customers:", error);
                setLoading(false);
            });
    }, [filters, loading]);

    const debouncedFetchCustomers = useCallback(
        debounce((pageNum: number, resetData: boolean) => fetchCustomers(pageNum, resetData), 350),
        [fetchCustomers]
    );

    const handleFilterChange = useCallback((field: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(0);
        setHasMore(true);
        if (field === 'customerName') {
            debouncedFetchCustomers(0, true);
        } else {
            fetchCustomers(0, true);
        }
    }, [debouncedFetchCustomers, fetchCustomers]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchCustomers(page + 1);
        }
    }, [loading, hasMore, page, fetchCustomers]);

    // Initial load
    useEffect(() => {
        fetchCustomers(0, true);
    }, []);

    return {
        allCustomers,
        displayedCustomers,
        filters,
        loading,
        hasMore,
        page,
        handleFilterChange,
        loadMore,
        fetchCustomers,
    };
};