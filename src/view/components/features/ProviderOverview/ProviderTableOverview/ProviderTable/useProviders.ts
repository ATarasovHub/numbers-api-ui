import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { NumberProvider } from '../../../../../../utils/domain';
import { ProviderService } from '../../../../../lib/api/providerService';

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
            const data = await ProviderService.fetchProviders(controller.signal);
            setAllProviders(data);
        } catch {
            setAllProviders([]);
        } finally {
            if (withLoading) setLoading(false);
            inFlightRef.current = false;
        }
    }, []);

    useEffect(() => {
        const startPolling = () => {
            if (pollRef.current == null) {
                pollRef.current = window.setInterval(() => fetchProviders(false), POLL_MS);
            }
        };
        const stopPolling = () => {
            if (pollRef.current != null) {
                clearInterval(pollRef.current);
                pollRef.current = null;
            }
        };

        const onVisibilityChange = () => {
            if (document.hidden) {
                stopPolling();
            } else {
                fetchProviders(false);
                startPolling();
            }
        };

        const onFocus = () => fetchProviders(false);

        fetchProviders(true);
        startPolling();

        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('focus', onFocus);

        return () => {
            stopPolling();
            abortRef.current?.abort();
            document.removeEventListener('visibilitychange', onVisibilityChange);
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

    const handleFilterChange = useCallback((field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, []);

    const refreshNow = useCallback(() => fetchProviders(true), [fetchProviders]);

    return {
        providers: filteredProviders,
        filters,
        loading,
        handleFilterChange,
        refreshNow,
    };
};