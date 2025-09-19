import { useState, useCallback } from 'react';
import { RangeAssignmentService } from '../services/rangeAssignmentService';
import { NumberOverview, CustomerData, TechAccountData } from '../types/rangeAssignmentTypes';

export const useRangeAssignment = () => {
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
            const data = await RangeAssignmentService.searchNumbers(filterPayload, currentPage, 20);

            if (reset) {
                setTableData(data);
                setPage(1);
            } else {
                setTableData(prev => [...prev, ...data]);
                setPage(prev => prev + 1);
            }
            setHasMore(data.length === 20);
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

    const fetchCustomerOptions = useCallback(async (searchText: string, pageNum: number, reset: boolean) => {
        setCustomerLoading(true);
        try {
            const data = await RangeAssignmentService.searchCustomers(searchText, pageNum, 10);
            if (reset) {
                setCustomerOptions(data.content);
            } else {
                setCustomerOptions(prev => [...prev, ...data.content]);
            }
            setCustomerHasMore(!data.last);
            setCustomerPage(pageNum);
        } catch (error) {
            console.error('Error fetching customers:', error);
            if (reset) setCustomerOptions([]);
            setCustomerHasMore(false);
        } finally {
            setCustomerLoading(false);
        }
    }, []);

    const fetchTechAccountOptions = useCallback(async (searchText: string, pageNum: number, reset: boolean) => {
        setTechAccountLoading(true);
        try {
            const data = await RangeAssignmentService.searchTechAccounts(searchText, pageNum, 10);
            if (reset) {
                setTechAccountOptions(data.content);
            } else {
                setTechAccountOptions(prev => [...prev, ...data.content]);
            }
            setTechAccountHasMore(!data.last);
            setTechAccountPage(pageNum);
        } catch (error) {
            console.error('Error fetching tech accounts:', error);
            if (reset) setTechAccountOptions([]);
            setTechAccountHasMore(false);
        } finally {
            setTechAccountLoading(false);
        }
    }, []);

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
        return await RangeAssignmentService.searchAllNumbersForExport(filterPayload);
    };

    return {
        filter, country, tableData, loading, hasMore, isInitialSearch,
        customerOptions, techAccountOptions, customerLoading, techAccountLoading,
        handleFilterChange, setCountry, handleSearch, searchNumbers,
        fetchCustomerOptions, fetchTechAccountOptions,
        loadMoreCustomers, loadMoreTechAccounts,
        setCurrentCustomerSearch, setCurrentTechAccountSearch,
        loadAllDataForPrint
    };
};