import { useState, useCallback, useEffect } from 'react';
import { Customer } from '../types/types';

const ITEMS_PER_PAGE = 20;

export interface FilterState {
    customerName: string;
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
    const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        customerName: '',
    });
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const fetchCustomers = useCallback((pageNum: number, currentFilters: FilterState, resetData = false) => {
        if (loading) return;
        setLoading(true);

        const params = new URLSearchParams({
            page: pageNum.toString(),
            size: ITEMS_PER_PAGE.toString()
        });

        if (currentFilters.customerName.trim()) {
            params.append('customerName', currentFilters.customerName.trim());
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

                setDisplayedCustomers(prev =>
                    pageNum === 0 ? normalized : [...prev, ...normalized]
                );

                setHasMore(!data.last);
                setPage(pageNum);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch customers:", error);
                setLoading(false);
            });
    }, []);

    const debouncedFetchWithFilters = useCallback(
        debounce((currentFilters: FilterState) => {
            setPage(0);
            setDisplayedCustomers([]);
            setHasMore(true);
            fetchCustomers(0, currentFilters, true);
        }, 500),
        [fetchCustomers]
    );

    useEffect(() => {
        if (page === 0) {
            debouncedFetchWithFilters(filters);
        }
    }, [filters, debouncedFetchWithFilters]);

    useEffect(() => {
        if (page > 0) {
            fetchCustomers(page, filters);
        }
    }, [page, fetchCustomers, filters]);

    const handleFilterChange = useCallback((field: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }, [loading, hasMore]);

    return {
        displayedCustomers,
        filters,
        loading,
        hasMore,
        handleFilterChange,
        loadMore,
    };
};