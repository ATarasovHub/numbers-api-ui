import React, { useState, useCallback, useMemo } from 'react';
import {
    Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
    TextField, Select, MenuItem, Button, CircularProgress
} from '@mui/material';

const filterFields = [
    { label: "Number Range From", type: 'text', select: ['equals', 'greater', 'lower'] },
    { label: "Number Range To", type: 'text', select: ['equals', 'greater', 'lower'] },
    { label: "Start Date", type: 'date', select: ['equals', 'greater', 'lower'] },
    { label: "End Date", type: 'date', select: ['equals', 'greater', 'lower'] },
    { label: "Customer Name", type: 'text', select: ['contains', 'equals', 'start with', 'end with'] },
    { label: "Tech Account Name", type: 'text', select: ['contains', 'equals', 'start with', 'end with'] },
    { label: "Customer Status", type: 'text', select: ['equals'] },
    { label: "Tech Account Status", type: 'text', select: ['equals'] },
    { label: "Service Detail", type: 'text', select: ['contains', 'equals'] },
    { label: "Comment", type: 'text', select: ['contains', 'equals', 'start with', 'end with'] },
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
}

export function RangeAssignment() {
    const [filter, setFilter] = useState<any>({});
    const [tableData, setTableData] = useState<NumberOverview[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [country, setCountry] = useState('United States');
    const [isInitialSearch, setIsInitialSearch] = useState(true);

    const handleChange = (key: string, value: any) => {
        setFilter((f: any) => ({ ...f, [key]: value }));
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    const searchNumbers = async (reset = false) => {
        if (!country.trim()) return;

        const currentPage = reset ? 0 : page;
        setLoading(true);

        try {
            // Добавляем таймаут для защиты от слишком долгих запросов
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 секунд таймаут

            const response = await fetch(
                `http://localhost:8080/numbers/overview/country/${encodeURIComponent(country)}?page=${currentPage}&size=20`,
                { signal: controller.signal }
            );

            clearTimeout(timeoutId);

            if (response.ok) {
                const data: NumberOverview[] = await response.json();

                // Защита от слишком большого ответа
                if (data.length > 100) {
                    console.error('Response too large, limiting to first 20 items');
                    data.splice(20);
                }

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
    };

    const loadMore = useCallback(() => {
        if (!loading && hasMore && !isInitialSearch) {
            searchNumbers(false);
        }
    }, [loading, hasMore, isInitialSearch, page, country]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            loadMore();
        }
    }, [loadMore]);

    const compareString = (value: string, filterValue: string, operator: string): boolean => {
        if (!value) return false;

        switch (operator) {
            case 'equals':
                return value.toLowerCase() === filterValue.toLowerCase();
            case 'contains':
                return value.toLowerCase().includes(filterValue.toLowerCase());
            case 'start with':
                return value.toLowerCase().startsWith(filterValue.toLowerCase());
            case 'end with':
                return value.toLowerCase().endsWith(filterValue.toLowerCase());
            default:
                return true;
        }
    };

    const compareDate = (value: string | null, filterValue: string, operator: string): boolean => {
        if (!value || !filterValue) return true;

        try {
            const itemDate = new Date(value);
            const filterDate = new Date(filterValue);

            if (isNaN(itemDate.getTime()) || isNaN(filterDate.getTime())) return true;

            switch (operator) {
                case 'equals':
                    return itemDate.toDateString() === filterDate.toDateString();
                case 'greater':
                    return itemDate >= filterDate;
                case 'lower':
                    return itemDate <= filterDate;
                default:
                    return true;
            }
        } catch {
            return true;
        }
    };

    const compareNumberRangeFrom = (number: string, filterValue: string, operator: string): boolean => {
        const num = parseInt(number, 10);
        const filterNum = parseInt(filterValue, 10);

        if (isNaN(num) || isNaN(filterNum)) return true;

        switch (operator) {
            case 'equals':
                return num === filterNum;
            case 'greater':
                return num >= filterNum;
            case 'lower':
                return num <= filterNum;
            default:
                return true;
        }
    };

    const compareNumberRangeTo = (number: string, filterValue: string, operator: string): boolean => {
        const num = parseInt(number, 10);
        const filterNum = parseInt(filterValue, 10);

        if (isNaN(num) || isNaN(filterNum)) return true;

        switch (operator) {
            case 'equals':
                return num === filterNum;
            case 'greater':
                return num >= filterNum;
            case 'lower':
                return num <= filterNum;
            default:
                return true;
        }
    };

    const applyFilters = useCallback((data: NumberOverview[]): NumberOverview[] => {
        return data.filter(item => {
            for (const field of filterFields) {
                const fieldName = field.label;
                const fieldValue = filter[fieldName];
                const operator = filter[fieldName + '_op'] || field.select[0];

                if (fieldValue === undefined || fieldValue === '') continue;

                switch (fieldName) {
                    case "Number Range From":
                        if (!compareNumberRangeFrom(item.number, fieldValue, operator)) return false;
                        break;
                    case "Number Range To":
                        if (!compareNumberRangeTo(item.number, fieldValue, operator)) return false;
                        break;
                    case "Customer Name":
                        if (!compareString(item.customerName, fieldValue, operator)) return false;
                        break;
                    case "Tech Account Name":
                        if (!compareString(item.techAccountName, fieldValue, operator)) return false;
                        break;
                    case "Customer Status":
                        if (!compareString(item.customerStatus, fieldValue, operator)) return false;
                        break;
                    case "Tech Account Status":
                        if (!compareString(item.techAccountStatus, fieldValue, operator)) return false;
                        break;
                    case "Service Detail":
                        if (!compareString(item.serviceDetail, fieldValue, operator)) return false;
                        break;
                    case "Comment":
                        const comment = item.comment || '';
                        if (!compareString(comment, fieldValue, operator)) return false;
                        break;
                    case "Start Date":
                        if (!compareDate(item.startDate, fieldValue, operator)) return false;
                        break;
                    case "End Date":
                        if (!compareDate(item.endDate, fieldValue, operator)) return false;
                        break;
                }
            }
            return true;
        });
    }, [filter]);

    const filteredData = useMemo(() => {
        return applyFilters(tableData);
    }, [tableData, applyFilters]);

    const handleSearch = () => {
        setPage(0);
        setIsInitialSearch(true);
        setHasMore(true);
        searchNumbers(true);
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
                    />
                </Box>

                <Box sx={styles.filterContainer}>
                    {filterFields.map((field) => (
                        <Box key={field.label} sx={styles.filterRow}>
                            <Select
                                size="small"
                                value={filter[field.label + '_op'] ?? field.select[0]}
                                onChange={e => handleChange(field.label + '_op', e.target.value)}
                                sx={{ minWidth: 120 }}
                            >
                                {field.select.map(v =>
                                    <MenuItem value={v} key={v}>{v}</MenuItem>
                                )}
                            </Select>
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
                        </Box>
                    ))}
                </Box>
                <Box sx={styles.buttonContainer}>
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading || !country.trim()}
                    >
                        {loading && isInitialSearch ? <CircularProgress size={24} /> : 'Search'}
                    </Button>
                    <Button>Print the result</Button>
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
                                    <TableCell sx={{...styles.tableHeaderCell, width: '8%'}}>Customer Status</TableCell>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '8%'}}>Account Status</TableCell>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>Service Detail</TableCell>
                                    <TableCell sx={{...styles.tableHeaderCell, width: '10%'}}>Comment</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((row) => (
                                    <TableRow key={row.numberId} sx={styles.tableRow}>
                                        <TableCell>{row.number}</TableCell>
                                        <TableCell>{formatDate(row.startDate)}</TableCell>
                                        <TableCell>{formatDate(row.endDate)}</TableCell>
                                        <TableCell>{row.customerName}</TableCell>
                                        <TableCell>{row.techAccountName}</TableCell>
                                        <TableCell>{row.customerStatus}</TableCell>
                                        <TableCell>{row.techAccountStatus}</TableCell>
                                        <TableCell>{row.serviceDetail}</TableCell>
                                        <TableCell>{row.comment || ''}</TableCell>
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
        </Paper>
    );
}