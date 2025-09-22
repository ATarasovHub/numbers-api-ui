import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { NumberProvider } from '../utils/domain';

export const useProviders = () => {
    const [allProviders, setAllProviders] = useState<NumberProvider[]>([]);
    const [filters, setFilters] = useState({
        providerName: '',
        totalNumbers: '',
        totalNumbersOp: '>=',
        totalAssignedNumbers: '',
        totalAssignedNumbersOp: '>=',
        totalMonthlyCost: '',
        totalMonthlyCostOp: '>=',
    });
    const [loading, setLoading] = useState(true);

    const abortRef = useRef<AbortController | null>(null);
    const inFlightRef = useRef(false);
    const pollRef = useRef<number | null>(null);
    const POLL_MS = 15000;

    const fetchProviders = useCallback(async (withLoading: boolean) => {
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        if (withLoading) setLoading(true);
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        try {
            const res = await fetch(`http://localhost:8080/provider`, { signal: controller.signal, cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: NumberProvider[] = await res.json();
            setAllProviders(data);
        } catch {
            setAllProviders([]);
        } finally {
            if (withLoading) setLoading(false);
            inFlightRef.current = false;
        }
    }, []);

    useEffect(() => {
        const start = () => {
            if (pollRef.current == null) {
                pollRef.current = window.setInterval(() => fetchProviders(false), POLL_MS);
            }
        };
        const stop = () => {
            if (pollRef.current != null) {
                clearInterval(pollRef.current);
                pollRef.current = null;
            }
        };
        const onVisibility = () => {
            if (document.hidden) {
                stop();
            } else {
                fetchProviders(false);
                start();
            }
        };
        const onFocus = () => fetchProviders(false);

        fetchProviders(true);
        start();
        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('focus', onFocus);

        return () => {
            stop();
            abortRef.current?.abort();
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('focus', onFocus);
        };
    }, [fetchProviders]);

    const filteredProviders = useMemo(() => {
        const isAllFiltersEmpty = !filters.providerName && !filters.totalNumbers && !filters.totalAssignedNumbers && !filters.totalMonthlyCost;
        if (isAllFiltersEmpty) return allProviders;

        const checkNumericFilter = (value: number, filterValue: string, op: string) => {
            if (filterValue) {
                const num = Number(filterValue);
                if (isNaN(num)) return true;
                if (op === '>=') return value >= num;
                if (op === '<=') return value <= num;
            }
            return true;
        };

        return allProviders.filter(provider => {
            if (filters.providerName && !provider.providerName.toLowerCase().includes(filters.providerName.toLowerCase())) return false;
            if (!checkNumericFilter(provider.totalNumbers, filters.totalNumbers, filters.totalNumbersOp)) return false;
            if (!checkNumericFilter(provider.totalAssignedNumbers, filters.totalAssignedNumbers, filters.totalAssignedNumbersOp)) return false;
            if (!checkNumericFilter(provider.totalMonthlyCost, filters.totalMonthlyCost, filters.totalMonthlyCostOp)) return false;
            return true;
        });
    }, [allProviders, filters]);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const refreshNow = () => fetchProviders(true);

    return {
        providers: filteredProviders,
        filters,
        loading,
        handleFilterChange,
        refreshNow,
    };
};