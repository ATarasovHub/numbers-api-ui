import React, { useState, useCallback, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
    TextField, Select, MenuItem, Button, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, LinearProgress, Alert, Autocomplete, InputAdornment, AutocompleteRenderInputParams
} from '@mui/material';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import SearchIcon from '@mui/icons-material/Search';

const filterFields = [
    { label: "Number Range From", type: 'text', select: ['equals', 'greater', 'lower'] },
    { label: "Number Range To", type: 'text', select: ['equals', 'greater', 'lower'] },
    { label: "Start Date", type: 'date', select: ['equals', 'greater', 'lower'] },
    { label: "End Date", type: 'date', select: ['equals', 'greater', 'lower'] },
    { label: "Customer Name", type: 'autocomplete', select: ['contains', 'equals', 'start with', 'end with'] },
    { label: "Tech Account Name", type: 'autocomplete', select: ['contains', 'equals', 'start with', 'end with'] },
    { label: "Tech Account Status", type: 'text', select: ['equals'] },
    { label: "Service Detail", type: 'text', select: ['contains', 'equals'] },
    { label: "Comment", type: 'text', select: ['contains', 'equals', 'start with', 'end with'] },
    { label: "Assignment Status", type: 'text', select: ['equals', 'contains'] },
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

// Интерфейсы для данных API
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
    // Другие поля, если они есть
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

    // Состояния для автозаполнения
    const [customerOptions, setCustomerOptions] = useState<CustomerData[]>([]);
    const [techAccountOptions, setTechAccountOptions] = useState<TechAccountData[]>([]);
    const [customerLoading, setCustomerLoading] = useState(false);
    const [techAccountLoading, setTechAccountLoading] = useState(false);

    // Функция для загрузки подсказок для клиентов
    const fetchCustomerOptions = useCallback(async (searchText: string) => {
        if (searchText.length < 1) {
            setCustomerOptions([]);
            return;
        }
        setCustomerLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/customer/overview/search?name=${encodeURIComponent(searchText)}`
            );
            if (response.ok) {
                const data = await response.json();
                // Проверяем, что данные являются массивом
                if (Array.isArray(data)) {
                    setCustomerOptions(data);
                } else {
                    console.error('Customer data is not an array:', data);
                    setCustomerOptions([]);
                }
            } else {
                console.error('Failed to fetch customer options');
                setCustomerOptions([]);
            }
        } catch (error) {
            console.error('Error fetching customer options:', error);
            setCustomerOptions([]);
        } finally {
            setCustomerLoading(false);
        }
    }, []);

    // Функция для загрузки подсказок для технических аккаунтов
    const fetchTechAccountOptions = useCallback(async (searchText: string) => {
        if (searchText.length < 1) {
            setTechAccountOptions([]);
            return;
        }
        setTechAccountLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/accounts/search?query=${encodeURIComponent(searchText)}`
            );
            if (response.ok) {
                const data = await response.json();
                // Проверяем, что данные являются массивом
                if (Array.isArray(data)) {
                    setTechAccountOptions(data);
                } else {
                    console.error('Tech account data is not an array:', data);
                    setTechAccountOptions([]);
                }
            } else {
                console.error('Failed to fetch tech account options');
                setTechAccountOptions([]);
            }
        } catch (error) {
            console.error('Error fetching tech account options:', error);
            setTechAccountOptions([]);
        } finally {
            setTechAccountLoading(false);
        }
    }, []);

    // Загрузка всех опций при первом рендере
    useEffect(() => {
        fetchCustomerOptions('');
        fetchTechAccountOptions('');
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
            filterPayload.numberRangeFromOp = filter["Number Range From_op"] || "equals";
        }
        if (filter["Number Range To"]) {
            filterPayload.numberRangeTo = filter["Number Range To"];
            filterPayload.numberRangeToOp = filter["Number Range To_op"] || "equals";
        }
        if (filter["Start Date"]) {
            filterPayload.startDate = filter["Start Date"] + "T00:00:00";
            filterPayload.startDateOp = filter["Start Date_op"] || "equals";
        }
        if (filter["End Date"]) {
            filterPayload.endDate = filter["End Date"] + "T23:59:59";
            filterPayload.endDateOp = filter["End Date_op"] || "equals";
        }
        if (filter["Customer Name"]) {
            filterPayload.customerName = filter["Customer Name"];
            filterPayload.customerNameOp = filter["Customer Name_op"] || "contains";
        }
        if (filter["Tech Account Name"]) {
            filterPayload.techAccountName = filter["Tech Account Name"];
            filterPayload.techAccountNameOp = filter["Tech Account Name_op"] || "contains";
        }
        if (filter["Tech Account Status"]) {
            filterPayload.techAccountStatus = filter["Tech Account Status"];
            filterPayload.techAccountStatusOp = filter["Tech Account Status_op"] || "equals";
        }
        if (filter["Service Detail"]) {
            filterPayload.serviceDetail = filter["Service Detail"];
            filterPayload.serviceDetailOp = filter["Service Detail_op"] || "contains";
        }
        if (filter["Comment"]) {
            filterPayload.comment = filter["Comment"];
            filterPayload.commentOp = filter["Comment_op"] || "contains";
        }
        if (filter["Assignment Status"]) {
            filterPayload.assignmentStatus = filter["Assignment Status"];
            filterPayload.assignmentStatusOp = filter["Assignment Status_op"] || "equals";
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

    const generatePDF = useCallback((dataToPrint: NumberOverview[]) => {
        try {
            console.log('Generating PDF with', dataToPrint.length, 'records');
            if (dataToPrint.length === 0) {
                console.warn('No data to generate PDF');
                alert('No data available to generate PDF');
                return;
            }
            const doc = new jsPDF('landscape');
            doc.setFontSize(16);
            doc.text('Range Assignment Report', 14, 15);
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
            doc.text(`Total Records: ${dataToPrint.length}`, 14, 28);
            const tableData = dataToPrint.map(row => [
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
            console.log('Table data prepared:', tableData.length, 'rows');
            autoTable(doc, {
                head: [['Number', 'Start Date', 'End Date', 'Customer', 'Tech Account',
                    'Acct Status', 'Service Detail', 'Comment', 'Assignment Status']],
                body: tableData,
                startY: 35,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    textColor: [50, 50, 50]
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 9
                },
                alternateRowStyles: {
                    fillColor: [249, 249, 249]
                },
                margin: { top: 35, right: 10, bottom: 10, left: 10 },
                theme: 'grid',
                tableWidth: 'auto',
                columnStyles: {
                    0: { cellWidth: 25 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 30 },
                    4: { cellWidth: 30 },
                    5: { cellWidth: 20 },
                    6: { cellWidth: 25 },
                    7: { cellWidth: 30 },
                    8: { cellWidth: 25 },
                }
            });
            const filename = `range_assignment_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
            console.log('PDF saved as:', filename);
        } catch (error) {
            console.error('Error generating PDF:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert('Failed to generate PDF: ' + errorMessage);
        }
    }, []);

    const loadAllDataForPrint = async () => {
        setPrintLoading(true);
        setPrintProgress(0);
        try {
            const filterPayload = buildFilterPayload();
            console.log('Loading all data for print from /numbers/overview/searchP...');
            // Имитация прогресса загрузки
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
                console.log(`Loaded ${data.length} records for print`);
                if (data.length === 0) {
                    console.warn('No data loaded for print');
                    return { success: false, data: [] };
                }
                setPrintData(data);
                setPrintProgress(100);
                return { success: true, data: data };
            } else {
                console.error('Failed to load data for print:', response.status, response.statusText);
                return { success: false, data: [] };
            }
        } catch (error) {
            console.error('Error loading all data for print:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert('Failed to load all data for printing: ' + errorMessage);
            return { success: false, data: [] };
        } finally {
            setPrintLoading(false);
        }
    };

    const handlePrint = async () => {
        console.log('Starting print process...');
        setPrintDialogOpen(true);
        try {
            const result = await loadAllDataForPrint();
            if (result.success && result.data.length > 0) {
                console.log('Data loaded successfully, generating PDF...');
                console.log('Data to print:', result.data.length, 'records');
                setTimeout(() => {
                    generatePDF(result.data);
                    setPrintDialogOpen(false);
                    setPrintData([]);
                    setPrintProgress(0);
                }, 500);
            } else {
                console.error('Failed to load data for print');
                alert('Failed to load data for printing. Please check your search criteria.');
                setPrintDialogOpen(false);
                setPrintData([]);
                setPrintProgress(0);
            }
        } catch (error) {
            console.error('Error in print process:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert('Error during print process: ' + errorMessage);
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
        alert(`Current data: ${tableData.length} records. Print data: ${printData.length} records. Check console for details.`);
    };

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
                                                fetchCustomerOptions(value);
                                            } else {
                                                fetchTechAccountOptions(value);
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
                                    />
                                </Box>
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
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading}
                        startIcon={loading && isInitialSearch ? <CircularProgress size={24} /> : <SearchIcon />}
                    >
                        {loading && isInitialSearch ? 'Searching...' : 'Search'}
                    </Button>
                    <Button
                        onClick={handlePrint}
                        disabled={tableData.length === 0}
                    >
                        Print the result
                    </Button>
                    <Button
                        onClick={handleDebugPrint}
                        color="secondary"
                    >
                        Debug Print Data
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
                <DialogTitle>Preparing PDF Export</DialogTitle>
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
                                Data loaded successfully! Generating PDF...
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