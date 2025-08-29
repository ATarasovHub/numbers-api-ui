import { useState, useCallback } from 'react';
import { Customer } from './types';

const ITEMS_PER_PAGE = 20;

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null;
    return (...args: any[]) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args as Parameters<T>), wait);
    };
}

export const useCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filters, setFilters] = useState({
        customerName: '',
        totalNumbers: '',
        totalNumbersOp: '>='
    });
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const fetchCustomers = useCallback((pageNum: number, resetData = false, currentFilters: typeof filters) => {
        if (loading && !resetData) return;

        setLoading(true);
        const params = new URLSearchParams({
            page: pageNum.toString(),
            size: ITEMS_PER_PAGE.toString()
        });

        if (currentFilters.customerName.trim()) {
            params.append('customerName', currentFilters.customerName.trim());
        }
        if (currentFilters.totalNumbers.trim()) {
            if (!isNaN(Number(currentFilters.totalNumbers))) {
                params.append('totalNumbers', currentFilters.totalNumbers.trim());
                params.append('totalNumbersOp', currentFilters.totalNumbersOp);
            }
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
                    setCustomers(normalized);
                } else {
                    setCustomers(prev => [...prev, ...normalized]);
                }

                setHasMore(!data.last);
                setPage(pageNum);
            })
            .catch((error) => {
                console.error("Failed to fetch customers:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [loading]);

    const debouncedFetch = useCallback(debounce((p, r, f) => fetchCustomers(p, r, f), 350), [fetchCustomers]);

    const handleFilterChange = (field: string, value: string) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        setPage(0);
        setHasMore(true);

        if (field === 'customerName') {
            debouncedFetch(0, true, newFilters);
        } else {
            fetchCustomers(0, true, newFilters);
        }
    };

    const loadMoreCustomers = () => {
        if (!loading && hasMore) {
            fetchCustomers(page + 1, false, filters);
        }
    };

    return {
        customers,
        filters,
        loading,
        hasMore,
        handleFilterChange,
        loadMoreCustomers,
    };
};
