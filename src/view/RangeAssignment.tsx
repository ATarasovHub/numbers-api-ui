import React, { useState, useCallback, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
    TextField, Select, MenuItem, Button, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, LinearProgress, Alert, Autocomplete, InputAdornment, AutocompleteRenderInputParams
} from '@mui/material';
import * as XLSX from 'xlsx';
import SearchIcon from '@mui/icons-material/Search';

const basicFilterFields = [
    { label: "Customer Name", type: 'autocomplete' },
    { label: "Assignment Status", type: 'select', options: ['Assigned', 'Unassigned'] },
    { label: "Tech Account Name", type: 'autocomplete' }
];

const advancedFilterFields = [
    { label: "Number Range From", type: 'text' },
    { label: "Number Range To", type: 'text' },
    { label: "Start Date", type: 'date' },
    { label: "End Date", type: 'date' },
    { label: "Tech Account Status", type: 'select', options: ['Active', 'Deleted'] },
    { label: "Service Detail", type: 'text' },
    { label: "Comment", type: 'text' }
];

const styles = {
    inactiveCell: {
        color: '#9e9e9e',
        backgroundColor: '#f5f5f5',
        cursor: 'default',
        userSelect: 'none',
        opacity: 0.7,
        '&:hover': {
            backgroundColor: '#f5f5f5',
        }
    },
    activeField: {
        '& .MuiInputBase-root': {
            backgroundColor: '#fafafa',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#bdbdbd',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9e9e9e',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#757575',
        },
    },
    inactiveSelect: {
        '& .MuiSelect-select': {
            backgroundColor: '#f5f5f5',
            color: '#9e9e9e',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0',
        },
    },
    mainContainer: {
        p: 3,
        maxWidth: 1200,
        m: '40px auto',
        borderRadius: 2
    },
    title: {
        mb: 2,
        fontWeight: 700
    },
    sectionTitle: {
        fontWeight: 600
    },
    filterRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 1
    },
    filterContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
    },
    buttonContainer: {
        mt: 2,
        display: 'flex',
        gap: 1
    },
    tableContainer: {
        p: 2,
        mt: 3,
        width: '100%'
    },
    tableHeader: {
        backgroundColor: '#e6f7ff'
    },
    tableHeaderCell: {
        fontWeight: '600',
        fontSize: '0.8rem'
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#f9f9f9'
        }
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        p: 3
    },
    scrollContainer: {
        maxHeight: 400,
        overflowY: 'auto'
    },
    loadMoreContainer: {
        display: 'flex',
        justifyContent: 'center',
        p: 2
    },
    autocompleteLoading: {
        position: 'absolute',
        right: 30,
        top: '50%',
        transform: 'translateY(-50%)'
    }
};

interface NumberOverview {
    numberId: number;
    number: string;
    startDate: string | null;
    endDate: string | null;
    customerName: string;
    techAccountName: string;
    customerStatus: string;
    techAccountStatus: string;
    serviceDetail: string;
    comment: string | null;
    monthlyCost: number | null;
    countryId: number;
    countryName: string;
    assignmentStatus: string;
}

interface CustomerData {
    customerId: number;
    customerName: string;
    productType: string;
    totalNumbers: number;
    proAccounts: ProAccount[];
}

interface ProAccount {
    techAccountId: number;
    techAccountName: string;
    totalAccounts: number;
    totalNumbers: number;
}

interface TechAccountData {
    techAccountId: number;
    techAccountName: string;
}

export function RangeAssignment() {
    const [filter, setFilter] = useState<any>({});
    const [tableData, setTableData] = useState<NumberOverview[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [country, setCountry] = useState('United States');
    const [isInitialSearch, setIsInitialSearch] = useState(true);
    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    const [printLoading, setPrintLoading] = useState(false);
    const [printProgress, setPrintProgress] = useState(0);
    const [printData, setPrintData] = useState<NumberOverview[]>([]);

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
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const fetchCustomerOptions = useCallback(async (searchText: string, page: number = 0, reset: boolean = true) => {
        setCustomerLoading(true);
        try {
            console.log('Fetching customers with query:', searchText, 'page:', page);
            const url = `http://localhost:8080/customer/overview/search?name=${encodeURIComponent(searchText)}&page=${page}&size=10`;
            console.log('Request URL:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Received data:', data);

                if (data && typeof data === 'object' && data.content && Array.isArray(data.content)) {
                    console.log('Found customers (paginated):', data.content.length);
                    if (reset) {
                        setCustomerOptions(data.content);
                    } else {
                        setCustomerOptions(prev => [...prev, ...data.content]);
                    }
                    setCustomerHasMore(!data.last);
                    setCustomerPage(page);
                } else {
                    console.error('Customer data format is incorrect:', data);
                    if (reset) {
                        setCustomerOptions([]);
                        setCustomerHasMore(false);
                    }
                }
            } else {
                console.error('Failed to fetch customer options:', response.status, response.statusText);
                if (reset) {
                    setCustomerOptions([]);
                    setCustomerHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error fetching customer options:', error);
            if (reset) {
                setCustomerOptions([]);
                setCustomerHasMore(false);
            }
        } finally {
            setCustomerLoading(false);
        }
    }, []);

    const fetchTechAccountOptions = useCallback(async (searchText: string, page: number = 0, reset: boolean = true) => {
        setTechAccountLoading(true);
        try {
            console.log('Fetching tech accounts with query:', searchText, 'page:', page);
            const url = `http://localhost:8080/accounts/search?query=${encodeURIComponent(searchText)}&page=${page}&size=10`;
            console.log('Request URL:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Received data:', data);

                if (data && typeof data === 'object' && data.content && Array.isArray(data.content)) {
                    console.log('Found tech accounts (paginated):', data.content.length);
                    if (reset) {
                        setTechAccountOptions(data.content);
                    } else {
                        setTechAccountOptions(prev => [...prev, ...data.content]);
                    }
                    setTechAccountHasMore(!data.last);
                    setTechAccountPage(page);
                } else {
                    console.error('Tech account data format is incorrect:', data);
                    if (reset) {
                        setTechAccountOptions([]);
                        setTechAccountHasMore(false);
                    }
                }
            } else {
                console.error('Failed to fetch tech account options:', response.status, response.statusText);
                if (reset) {
                    setTechAccountOptions([]);
                    setTechAccountHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error fetching tech account options:', error);
            if (reset) {
                setTechAccountOptions([]);
                setTechAccountHasMore(false);
            }
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

    useEffect(() => {
        setCurrentCustomerSearch('');
        setCurrentTechAccountSearch('');
        fetchCustomerOptions('', 0, true);
        fetchTechAccountOptions('', 0, true);
    }, [fetchCustomerOptions, fetchTechAccountOptions]);

    const handleChange = (key: string, value: any) => {
        setFilter((f: any) => ({ ...f, [key]: value }));
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    const buildFilterPayload = useCallback(() => {
        const filterPayload: any = {
            countryName: country || undefined
        };
        if (filter["Number Range From"]) {
            filterPayload.numberRangeFrom = filter["Number Range From"];
        }
        if (filter["Number Range To"]) {
            filterPayload.numberRangeTo = filter["Number Range To"];
        }
        if (filter["Start Date"]) {
            filterPayload.startDate = filter["Start Date"] + "T00:00:00";
        }
        if (filter["End Date"]) {
            filterPayload.endDate = filter["End Date"] + "T23:59:59";
        }
        if (filter["Customer Name"]) {
            filterPayload.customerName = filter["Customer Name"];
        }
        if (filter["Tech Account Name"]) {
            filterPayload.techAccountName = filter["Tech Account Name"];
        }
        if (filter["Tech Account Status"]) {
            filterPayload.techAccountStatus = filter["Tech Account Status"];
        }
        if (filter["Service Detail"]) {
            filterPayload.serviceDetail = filter["Service Detail"];
        }
        if (filter["Comment"]) {
            filterPayload.comment = filter["Comment"];
        }
        if (filter["Assignment Status"]) {
            filterPayload.assignmentStatus = filter["Assignment Status"];
        }
        return filterPayload;
    }, [country, filter]);

    const searchNumbers = useCallback(async (reset = false) => {
        const currentPage = reset ? 0 : page;
        setLoading(true);
        try {
            const filterPayload = buildFilterPayload();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            const response = await fetch(
                `http://localhost:8080/numbers/overview/search?page=${currentPage}&size=20`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(filterPayload),
                    signal: controller.signal
                }
            );
            clearTimeout(timeoutId);
            if (response.ok) {
                const data: NumberOverview[] = await response.json();
                if (reset) {
                    setTableData(data);
                    setIsInitialSearch(false);
                    setPage(1);
                } else {
                    setTableData(prev => [...prev, ...data]);
                    setPage(prev => prev + 1);
                }
                setHasMore(data.length === 20);
            } else {
                console.error('Failed to fetch data');
                if (reset) {
                    setTableData([]);
                    setHasMore(false);
                }
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.error('Request timeout - too many records');
                alert('The search is taking too long. Please try a more specific search.');
            } else {
                console.error('Error fetching data:', error);
            }
            if (reset) {
                setTableData([]);
                setHasMore(false);
            }
        } finally {
            setLoading(false);
        }
    }, [buildFilterPayload, country, filter, page]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            if (!loading && hasMore && !isInitialSearch) {
                searchNumbers(false);
            }
        }
    }, [loading, hasMore, isInitialSearch, searchNumbers]);

    const handleSearch = () => {
        setPage(0);
        setIsInitialSearch(true);
        setHasMore(true);
        searchNumbers(true);
    };

    const generateExcel = useCallback((dataToExport: NumberOverview[]) => {
        try {
            console.log('Generating Excel with', dataToExport.length, 'records');
            if (dataToExport.length === 0) {
                console.warn('No data to generate Excel');
                alert('No data available to generate Excel');
                return;
            }

            const workbook = XLSX.utils.book_new();

            const headers = [
                'Number', 'Start Date', 'End Date', 'Customer Name',
                'Tech Account', 'Account Status', 'Service Detail',
                'Comment', 'Assignment Status'
            ];

            const data = dataToExport.map(row => [
                row.number,
                formatDate(row.startDate),
                formatDate(row.endDate),
                row.customerName,
                row.techAccountName,
                row.techAccountStatus,
                row.serviceDetail,
                row.comment || '',
                row.assignmentStatus || ''
            ]);

            const worksheetData = [headers, ...data];
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

            const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
            const columnWidths = [
                { wch: 15 },
                { wch: 12 },
                { wch: 12 },
                { wch: 20 },
                { wch: 20 },
                { wch: 15 },
                { wch: 18 },
                { wch: 25 },
                { wch: 18 }
            ];
            worksheet['!cols'] = columnWidths;

            for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
                if (!worksheet[cellAddress]) continue;

                worksheet[cellAddress].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "2980B9" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                    }
                };
            }

            for (let row = 1; row <= dataToExport.length; row++) {
                for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                    if (!worksheet[cellAddress]) continue;

                    worksheet[cellAddress].s = {
                        fill: { fgColor: { rgb: row % 2 === 0 ? "F9F9F9" : "FFFFFF" } },
                        alignment: { horizontal: "left", vertical: "center" },
                        border: {
                            top: { style: "thin", color: { rgb: "CCCCCC" } },
                            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                            left: { style: "thin", color: { rgb: "CCCCCC" } },
                            right: { style: "thin", color: { rgb: "CCCCCC" } }
                        }
                    };
                }
            }

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Range Assignment');

            const summaryData = [
                ['Range Assignment Report'],
                ['Generated:', new Date().toLocaleString()],
                ['Total Records:', dataToExport.length.toString()],
                ['Country:', country || 'All Countries'],
                []
            ];

            const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
            summaryWorksheet['!cols'] = [{ wch: 20 }, { wch: 30 }];

            summaryWorksheet['A1'].s = {
                font: { bold: true, sz: 16 },
                alignment: { horizontal: "center" }
            };

            XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

            const filename = `range_assignment_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, filename);
            console.log('Excel file saved as:', filename);
        } catch (error) {
            console.error('Error generating Excel:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert('Failed to generate Excel: ' + errorMessage);
        }
    }, [country]);

    const loadAllDataForPrint = async () => {
        setPrintLoading(true);
        setPrintProgress(0);
        try {
            const filterPayload = buildFilterPayload();
            console.log('Loading all data for export from /numbers/overview/searchP...');

            const progressInterval = setInterval(() => {
                setPrintProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await fetch(
                `http://localhost:8080/numbers/overview/searchP`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(filterPayload),
                }
            );

            clearInterval(progressInterval);

            if (response.ok) {
                const data: NumberOverview[] = await response.json();
                console.log(`Loaded ${data.length} records for export`);
                if (data.length === 0) {
                    console.warn('No data loaded for export');
                    return { success: false, data: [] };
                }
                setPrintData(data);
                setPrintProgress(100);
                return { success: true, data: data };
            } else {
                console.error('Failed to load data for export:', response.status, response.statusText);
                return { success: false, data: [] };
            }
        } catch (error) {
            console.error('Error loading all data for export:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert('Failed to load all data for export: ' + errorMessage);
            return { success: false, data: [] };
        } finally {
            setPrintLoading(false);
        }
    };

    const handleExport = async () => {
        console.log('Starting export process...');
        setPrintDialogOpen(true);
        try {
            const result = await loadAllDataForPrint();
            if (result.success && result.data.length > 0) {
                console.log('Data loaded successfully, generating Excel...');
                console.log('Data to export:', result.data.length, 'records');
                setTimeout(() => {
                    generateExcel(result.data);
                    setPrintDialogOpen(false);
                    setPrintData([]);
                    setPrintProgress(0);
                }, 500);
            } else {
                console.error('Failed to load data for export');
                alert('Failed to load data for export. Please check your search criteria.');
                setPrintDialogOpen(false);
                setPrintData([]);
                setPrintProgress(0);
            }
        } catch (error) {
            console.error('Error in export process:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert('Error during export process: ' + errorMessage);
            setPrintDialogOpen(false);
            setPrintData([]);
            setPrintProgress(0);
        }
    };

    const handleDebugPrint = () => {
        console.log('Current table data:', tableData);
        console.log('Current filter:', filter);
        console.log('Current country:', country);
        console.log('Current print data:', printData);
        alert(`Current data: ${tableData.length} records. Export data: ${printData.length} records. Check console for details.`);
    };

    const toggleAdvancedFilters = () => {
        setShowAdvancedFilters(!showAdvancedFilters);
    };

    const filterFields = showAdvancedFilters
        ? [...basicFilterFields, ...advancedFilterFields]
        : basicFilterFields;

    return (
        <Paper sx={styles.mainContainer}>
            <Typography variant="h5" sx={styles.title}>Range Assignment</Typography>
            <Box sx={{ mb: 3 }}>
                <Typography sx={styles.sectionTitle}>Search</Typography>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        size="small"
                        label="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        sx={{ width: 300 }}
                        placeholder="Leave empty to search all countries"
                    />
                </Box>
                <Box sx={styles.filterContainer}>
                    {filterFields.map((field) => (
                        <Box key={field.label} sx={styles.filterRow}>
                            {field.type === 'autocomplete' ? (
                                <Box sx={{ position: 'relative', flexGrow: 1 }}>
                                    <Autocomplete
                                        freeSolo
                                        options={field.label === "Customer Name"
                                            ? customerOptions
                                            : techAccountOptions
                                        }
                                        loading={field.label === "Customer Name" ? customerLoading : techAccountLoading}
                                        onInputChange={(event, value) => {
                                            handleChange(field.label, value);
                                            if (field.label === "Customer Name") {
                                                setCurrentCustomerSearch(value);
                                                setCustomerPage(0);
                                                fetchCustomerOptions(value, 0, true);
                                            } else {
                                                setCurrentTechAccountSearch(value);
                                                setTechAccountPage(0);
                                                fetchTechAccountOptions(value, 0, true);
                                            }
                                        }}
                                        value={filter[field.label] || null}
                                        onChange={(event, value) => {
                                            if (field.label === "Customer Name") {
                                                const selectedValue = (value as CustomerData)?.customerName ?? value;
                                                handleChange(field.label, selectedValue || '');
                                            } else {
                                                const selectedValue = (value as TechAccountData)?.techAccountName ?? value;
                                                handleChange(field.label, selectedValue || '');
                                            }
                                        }}
                                        getOptionLabel={(option) => {
                                            if (typeof option === 'string') {
                                                return option;
                                            }
                                            if (field.label === "Customer Name") {
                                                return option.customerName;
                                            }
                                            return option.techAccountName;
                                        }}
                                        renderInput={(params: AutocompleteRenderInputParams) => (
                                            <TextField
                                                {...params}
                                                size="small"
                                                label={field.label}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {field.label === "Customer Name" && customerLoading && (
                                                                <CircularProgress color="inherit" size={20} sx={styles.autocompleteLoading} />
                                                            )}
                                                            {field.label === "Tech Account Name" && techAccountLoading && (
                                                                <CircularProgress color="inherit" size={20} sx={styles.autocompleteLoading} />
                                                            )}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    )
                                                }}
                                            />
                                        )}
                                        ListboxProps={{
                                            onScroll: (event: React.SyntheticEvent) => {
                                                const listboxNode = event.currentTarget as HTMLElement;
                                                const { scrollTop, scrollHeight, clientHeight } = listboxNode;

                                                if (scrollHeight - scrollTop <= clientHeight + 5) {
                                                    if (field.label === "Customer Name") {
                                                        loadMoreCustomers();
                                                    } else {
                                                        loadMoreTechAccounts();
                                                    }
                                                }
                                            },
                                        }}
                                    />
                                </Box>
                            ) : field.type === 'select' ? (
                                <Select
                                    size="small"
                                    value={filter[field.label] || ''}
                                    onChange={(e) => handleChange(field.label, e.target.value)}
                                    displayEmpty
                                    sx={{ flexGrow: 1 }}
                                >
                                    <MenuItem value="">
                                        <em>Select {field.label}</em>
                                    </MenuItem>
                                    {field.options?.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            ) : (
                                <TextField
                                    size="small"
                                    type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                                    label={field.label}
                                    value={filter[field.label] ?? ''}
                                    onChange={e => handleChange(field.label, e.target.value)}
                                    sx={{ flexGrow: 1 }}
                                    InputLabelProps={{
                                        shrink: field.type === 'date' ? true : undefined
                                    }}
                                />
                            )}
                        </Box>
                    ))}
                </Box>
                <Box sx={styles.buttonContainer}>
                    <Button
                        variant="outlined"
                        onClick={toggleAdvancedFilters}
                    >
                        {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading}
                        startIcon={loading && isInitialSearch ? <CircularProgress size={24} /> : <SearchIcon />}
                    >
                        {loading && isInitialSearch ? 'Searching...' : 'Search'}
                    </Button>
                    <Button
                        onClick={handleExport}
                        disabled={tableData.length === 0}
                    >
                        Export to Excel
                    </Button>
                    <Button
                        onClick={handleDebugPrint}
                        color="secondary"
                    >
                        Debug Export Data
                    </Button>
                </Box>
            </Box>
            <Paper sx={styles.tableContainer}>
                <Typography sx={styles.sectionTitle}>Range Table</Typography>
                {loading && isInitialSearch ? (
                    <Box sx={styles.loadingContainer}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box
                        sx={styles.scrollContainer}
                        onScroll={handleScroll}
                    >
                        <Table size="small" sx={{ width: '100%' }}>
                            <TableHead sx={styles.tableHeader}>
                                <TableRow>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>Number</TableCell>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>Start Date</TableCell>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>End Date</TableCell>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>Customer Name</TableCell>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>Tech Account</TableCell>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '8%'}}>Account Status</TableCell>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>Service Detail</TableCell>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '10%'}}>Comment</TableCell>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '10%'}}>Assignment Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row) => (
                                    <TableRow key={row.numberId} sx={styles.tableRow}>
                                        <TableCell>{row.number}</TableCell>
                                        <TableCell>{formatDate(row.startDate)}</TableCell>
                                        <TableCell>{formatDate(row.endDate)}</TableCell>
                                        <TableCell>{row.customerName}</TableCell>
                                        <TableCell>{row.techAccountName}</TableCell>
                                        <TableCell>{row.techAccountStatus}</TableCell>
                                        <TableCell>{row.serviceDetail}</TableCell>
                                        <TableCell>{row.comment || ''}</TableCell>
                                        <TableCell>{row.assignmentStatus || ''}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {loading && !isInitialSearch && (
                            <Box sx={styles.loadMoreContainer}>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                        {!hasMore && tableData.length > 0 && (
                            <Box sx={{ textAlign: 'center', p: 2, color: '#666' }}>
                                <Typography>No more data to load</Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Paper>
            <Dialog open={printDialogOpen} maxWidth="sm" fullWidth>
                <DialogTitle>Preparing Excel Export</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%', mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Loading all data for export...
                        </Typography>
                        <LinearProgress variant="determinate" value={printProgress} />
                        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                            {printProgress}%
                        </Typography>
                        {printProgress === 100 && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                Data loaded successfully! Generating Excel file...
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setPrintDialogOpen(false);
                            setPrintData([]);
                            setPrintProgress(0);
                        }}
                        disabled={printLoading}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}