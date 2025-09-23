import React, { useState, useRef, useCallback, useEffect } from 'react';
import { customerTableService } from '../components/CustomerTable/customerTableService';

interface UseCustomerTableProps {
    loading: boolean;
    hasMore: boolean;
    loadMore: () => void;
}

export const useCustomerTable = ({
                                     loading,
                                     hasMore,
                                     loadMore,
                                 }: UseCustomerTableProps) => {
    const [openRows, setOpenRows] = useState<Record<number, boolean>>({});
    const [expandedAccounts, setExpandedAccounts] = useState<Record<number, boolean>>({});
    const [accountDetails, setAccountDetails] = useState<Record<number, any>>({});
    const [loadingAccount, setLoadingAccount] = useState<Record<number, boolean>>({});
    const [accountDetailsHasMore, setAccountDetailsHasMore] = useState<Record<number, boolean>>({});
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const accountDetailsScrollRefs = useRef<Record<number, React.RefObject<HTMLDivElement | null>>>({});

    const handleScroll = useCallback(() => {
        const container = tableContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollHeight - scrollTop <= clientHeight * 1.1) {
                if (!loading && hasMore) {
                    loadMore();
                }
            }
        }
    }, [loading, hasMore, loadMore]);

    const getOrCreateScrollRef = useCallback((techAccountId: number): React.RefObject<HTMLDivElement | null> => {
        if (!accountDetailsScrollRefs.current[techAccountId]) {
            accountDetailsScrollRefs.current[techAccountId] = React.createRef<HTMLDivElement>();
        }
        return accountDetailsScrollRefs.current[techAccountId];
    }, []);

    const fetchAccountDetails = useCallback((
        customerName: string,
        techAccountId: number,
        pageNum: number,
        searchNumber?: string
    ) => {
        if (loadingAccount[techAccountId]) return;

        setLoadingAccount(prev => ({ ...prev, [techAccountId]: true }));

        customerTableService.fetchAccountDetails(customerName, techAccountId, pageNum, searchNumber)
            .then(response => {
                const isLastPage = response.last;
                const newContent = response.content;

                setAccountDetails(prev => ({
                    ...prev,
                    [techAccountId]: pageNum === 0 ? newContent : [...(prev[techAccountId] || []), ...newContent],
                }));

                setAccountDetailsHasMore(prev => ({ ...prev, [techAccountId]: !isLastPage }));
                setExpandedAccounts(prev => ({ ...prev, [techAccountId]: true }));
            })
            .catch(err => {
                console.error(`Error loading account details: ${err}`);
                setExpandedAccounts(prev => ({ ...prev, [techAccountId]: false }));
            })
            .finally(() => {
                setLoadingAccount(prev => ({ ...prev, [techAccountId]: false }));
            });
    }, [loadingAccount]);

    const handleRowToggle = useCallback((customerId: number) => {
        setOpenRows(prev => ({ ...prev, [customerId]: !prev[customerId] }));
    }, []);

    const handleAccountToggle = useCallback((techAccountId: number) => {
        setExpandedAccounts(prev => ({ ...prev, [techAccountId]: !prev[techAccountId] }));
    }, []);

    useEffect(() => {
        if (loading) return;
        if (!hasLoadedOnce) {
            setHasLoadedOnce(true);
        }
    }, [loading, hasLoadedOnce]);

    return {
        openRows,
        expandedAccounts,
        accountDetails,
        loadingAccount,
        accountDetailsHasMore,
        hasLoadedOnce,
        tableContainerRef,
        getOrCreateScrollRef,
        handleScroll,
        fetchAccountDetails,
        handleRowToggle,
        handleAccountToggle,
        setHasLoadedOnce,
    };
};