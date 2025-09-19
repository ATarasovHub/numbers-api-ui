import { useState, useEffect, useMemo, useCallback } from 'react';
import { TechAccountDetails } from "../../../types/types";

interface UseAccountDetailsTableProps {
    initialDetails?: TechAccountDetails[];
    searchQuery: string;
    onSearchSubmit: () => void;
    onSearchReset: () => void;
    onSearchChange: (query: string) => void;
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
    scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const useAccountDetailsTable = ({
                                           initialDetails,
                                           searchQuery,
                                           onSearchSubmit,
                                           onSearchReset,
                                           onSearchChange,
                                           onLoadMore,
                                           hasMore,
                                           loading,
                                           scrollRef,
                                       }: UseAccountDetailsTableProps) => {
    const [details, setDetails] = useState<TechAccountDetails[]>(initialDetails || []);
    const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>('');

    useEffect(() => {
        setDetails(initialDetails || []);
    }, [initialDetails]);

    const cleanNumber = (num: string): string => num.replace(/[^0-9]/g, '');

    const filteredDetails = useMemo(() => {
        if (!appliedSearchQuery.trim()) return details;
        const queryClean = cleanNumber(appliedSearchQuery);
        return details.filter(detail =>
            cleanNumber(detail.number).includes(queryClean)
        );
    }, [details, appliedSearchQuery]);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current || loading || !hasMore) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            onLoadMore();
        }
    }, [loading, hasMore, onLoadMore, scrollRef]);

    useEffect(() => {
        if (filteredDetails.length > 0 && appliedSearchQuery.trim()) {
            const container = scrollRef.current;
            if (container) {
                const firstRow = container.querySelector('table tbody tr');
                if (firstRow) {
                    firstRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        }
    }, [filteredDetails, appliedSearchQuery, scrollRef]);

    const handleLocalSearchSubmit = () => {
        setAppliedSearchQuery(searchQuery);
        onSearchSubmit();
    };

    const handleResetSearch = () => {
        onSearchChange('');
        setAppliedSearchQuery('');
        onSearchReset();
    };

    return {
        details,
        filteredDetails,
        appliedSearchQuery,
        handleLocalSearchSubmit,
        handleResetSearch,
        handleScroll,
    };
};