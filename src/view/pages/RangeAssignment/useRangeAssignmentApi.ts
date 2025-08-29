import { useState, useCallback } from 'react';
import { NumberOverview, CustomerData, TechAccountData } from './types';

export const useRangeAssignmentApi = () => {
    const [filter, setFilter] = useState<any>({});
    const [country, setCountry] = useState('United States');

    const [tableData, setTableData] = useState<NumberOverview[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [isInitialSearch, setIsInitialSearch] = useState(true);

    const [customerOptions, setCustomerOptions] = useState<CustomerData[]>([]);
    const [techAccountOptions, setTechAccountOptions] = useState<TechAccountData[]>([]);
    const [customerLoading, setCustomerLoading] = useState(false);
    const [techAccountLoading, setTechAccountLoading] = useState(false);
    const [customerPage, setCustomerPage] = useState(0);
    const [techAccountPage, setTechAccountPage] = useState(0);
    const [customerHasMore, setCustomerHasMore] = useState(true);
    const [techAccountHasMore, setTechAccountHasMore] = useState(true);
    const [currentCustomerSearch, setCurrentCustomerSearch] = useState('');
    const [currentTechAccountSearch, setCurrentTechAccountSearch] = useState('');

    const handleFilterChange = (key: string, value: any) => {
        setFilter((f: any) => ({ ...f, [key]: value }));
    };

    const buildFilterPayload = useCallback(() => {
        const payload: any = { countryName: country || undefined };
        if (filter["Number Range From"]) payload.numberRangeFrom = filter["Number Range From"];
        if (filter["Number Range To"]) payload.numberRangeTo = filter["Number Range To"];
        if (filter["Start Date"]) payload.startDate = filter["Start Date"] + "T00:00:00";
        if (filter["End Date"]) payload.endDate = filter["End Date"] + "T23:59:59";
        if (filter["Customer Name"]) payload.customerName = filter["Customer Name"];
        if (filter["Tech Account Name"]) payload.techAccountName = filter["Tech Account Name"];
        if (filter["Tech Account Status"]) payload.techAccountStatus = filter["Tech Account Status"];
        if (filter["Service Detail"]) payload.serviceDetail = filter["Service Detail"];
        if (filter["Comment"]) payload.comment = filter["Comment"];
        if (filter["Assignment Status"]) payload.assignmentStatus = filter["Assignment Status"];
        return payload;
    }, [country, filter]);

    const searchNumbers = useCallback(async (reset = false) => {
        const currentPage = reset ? 0 : page;
        setLoading(true);
        if(reset) setIsInitialSearch(true);

        try {
            const filterPayload = buildFilterPayload();
            const response = await fetch(`http://localhost:8080/numbers/overview/search?page=${currentPage}&size=20`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filterPayload),
            });
            if (response.ok) {
                const data: NumberOverview[] = await response.json();
                if (reset) {
                    setTableData(data);
                    setPage(1);
                } else {
                    setTableData(prev => [...prev, ...data]);
                    setPage(prev => prev + 1);
                }
                setHasMore(data.length === 20);
            } else {
                if (reset) setTableData([]);
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            if (reset) setTableData([]);
            setHasMore(false);
        } finally {
            setLoading(false);
            if(reset) setIsInitialSearch(false);
        }
    }, [buildFilterPayload, page]);

    const handleSearch = () => {
        setPage(0);
        setHasMore(true);
        searchNumbers(true);
    };

    const fetchOptions = useCallback(async (
        url: string,
        setter: React.Dispatch<React.SetStateAction<any[]>>,
        hasMoreSetter: React.Dispatch<React.SetStateAction<boolean>>,
        pageSetter: React.Dispatch<React.SetStateAction<number>>,
        loadingSetter: React.Dispatch<React.SetStateAction<boolean>>,
        page: number,
        reset: boolean
    ) => {
        loadingSetter(true);
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data && Array.isArray(data.content)) {
                    if (reset) setter(data.content);
                    else setter(prev => [...prev, ...data.content]);
                    hasMoreSetter(!data.last);
                    pageSetter(page);
                } else {
                    if (reset) setter([]);
                    hasMoreSetter(false);
                }
            } else {
                if (reset) setter([]);
                hasMoreSetter(false);
            }
        } catch (error) {
            console.error('Error fetching options:', error);
            if (reset) setter([]);
            hasMoreSetter(false);
        } finally {
            loadingSetter(false);
        }
    }, []);

    const fetchCustomerOptions = useCallback((searchText: string, pageNum: number, reset: boolean) => {
        const url = `http://localhost:8080/customer/overview/search?name=${encodeURIComponent(searchText)}&page=${pageNum}&size=10`;
        fetchOptions(url, setCustomerOptions, setCustomerHasMore, setCustomerPage, setCustomerLoading, pageNum, reset);
    }, [fetchOptions]);

    const fetchTechAccountOptions = useCallback((searchText: string, pageNum: number, reset: boolean) => {
        const url = `http://localhost:8080/accounts/search?query=${encodeURIComponent(searchText)}&page=${pageNum}&size=10`;
        fetchOptions(url, setTechAccountOptions, setTechAccountHasMore, setTechAccountPage, setTechAccountLoading, pageNum, reset);
    }, [fetchOptions]);

    const loadMoreCustomers = useCallback(() => {
        if (customerHasMore && !customerLoading && currentCustomerSearch) {
            fetchCustomerOptions(currentCustomerSearch, customerPage + 1, false);
        }
    }, [customerHasMore, customerLoading, currentCustomerSearch, customerPage, fetchCustomerOptions]);

    const loadMoreTechAccounts = useCallback(() => {
        if (techAccountHasMore && !techAccountLoading && currentTechAccountSearch) {
            fetchTechAccountOptions(currentTechAccountSearch, techAccountPage + 1, false);
        }
    }, [techAccountHasMore, techAccountLoading, currentTechAccountSearch, techAccountPage, fetchTechAccountOptions]);

    const loadAllDataForPrint = async () => {
        const filterPayload = buildFilterPayload();
        try {
            const response = await fetch(`http://localhost:8080/numbers/overview/searchP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filterPayload),
            });
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Error loading all data for export:', error);
            return null;
        }
    };

    return {
        filter, country, tableData, loading, hasMore, isInitialSearch,
        customerOptions, techAccountOptions, customerLoading, techAccountLoading,
        customerPage, techAccountPage,
        handleFilterChange, setCountry, handleSearch, searchNumbers,
        fetchCustomerOptions, fetchTechAccountOptions,
        loadMoreCustomers, loadMoreTechAccounts,
        setCurrentCustomerSearch, setCurrentTechAccountSearch,
        loadAllDataForPrint
    };
};
