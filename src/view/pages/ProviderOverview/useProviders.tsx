import { useState, useEffect, useMemo } from 'react';
import { NumberProvider } from '../../../utils/domain';

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

    useEffect(() => {
        fetch(`/provider`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: NumberProvider[]) => {
                setAllProviders(data);
            })
            .catch(error => {
                console.error("Failed to fetch providers:", error.message || 'Something went wrong');
                setAllProviders([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredProviders = useMemo(() => {
        const isAllFiltersEmpty = !filters.providerName && !filters.totalNumbers && !filters.totalAssignedNumbers && !filters.totalMonthlyCost;
        if (isAllFiltersEmpty) return allProviders;

        return allProviders.filter(provider => {
            let pass = true;
            if (filters.providerName && !provider.providerName.toLowerCase().includes(filters.providerName.toLowerCase())) pass = false;

            const checkNumericFilter = (value: number, filterValue: string, op: string) => {
                if(filterValue){
                    const numFilterValue = Number(filterValue);
                    if(isNaN(numFilterValue)) return true; // Or false, depending on desired behavior for invalid input
                    if (op === '>=') return value >= numFilterValue;
                    if (op === '<=') return value <= numFilterValue;
                }
                return true;
            }

            pass = pass && checkNumericFilter(provider.totalNumbers, filters.totalNumbers, filters.totalNumbersOp);
            pass = pass && checkNumericFilter(provider.totalAssignedNumbers, filters.totalAssignedNumbers, filters.totalAssignedNumbersOp);
            pass = pass && checkNumericFilter(provider.totalMonthlyCost, filters.totalMonthlyCost, filters.totalMonthlyCostOp);

            return pass;
        });
    }, [allProviders, filters]);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return {
        providers: filteredProviders,
        filters,
        loading,
        handleFilterChange,
    };
};
