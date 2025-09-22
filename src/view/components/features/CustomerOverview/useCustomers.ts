import {useState, useCallback, useEffect, useRef} from 'react';
import { Customer } from '../../../types/customerOverviewTypes';
import { CustomerService } from '../../../lib/api/customerService';
import { debounce } from '../../../../utils/debounce';

export interface FilterState {
    customerName: string;
}

export const useCustomers = () => {
    const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        customerName: '',
    });
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const fetchCustomers = useCallback(async (pageNum: number, currentFilters: FilterState) => {
        if (loading) return;
        setLoading(true);

        try {
            const data = await CustomerService.fetchCustomers(pageNum, currentFilters);

            setDisplayedCustomers(prev =>
                pageNum === 0 ? data.content : [...prev, ...data.content]
            );

            setHasMore(!data.last);
            setPage(pageNum);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const debouncedFetchRef = useRef(
        debounce((currentFilters: FilterState) => {
            fetchCustomers(0, currentFilters);
        }, 500)
    );

    useEffect(() => {
        debouncedFetchRef.current(filters);
    }, [filters]);

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