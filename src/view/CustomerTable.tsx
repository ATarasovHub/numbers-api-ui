import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    Card,
    Table,
    Collapse,
    IconButton,
    Paper,
    alpha,
    createTheme,
    ThemeProvider,
    CircularProgress,
    Chip
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// ----- DTO Types -----
export interface CustomerOverviewProAccount {
    techAccountId: number;
    techAccountName: string;
    techAccountStatus: string;
    totalNumbers: number;
}

export interface CustomerOverviewProCountry {
    countryId: number;
    countryName: string;
    totalAccounts: number;
    totalNumbers: number;
}

export interface Customer {
    customerId: number;
    customerName: string;
    productType: string;
    totalNumbers: number;
    proAccounts: CustomerOverviewProAccount[];
    proCountries: CustomerOverviewProCountry[];
}

export interface TechAccountDetails {
    startDate: string;
    endDate: string;
    number: string;
    comment: string | null;
    numberProviderName: string;
    serviceDetail: string;
}

// ----- Theme -----
const calmTheme = createTheme({
    palette: {
        primary: {
            main: 'hsl(224, 76%, 31%)',
            light: 'hsl(214, 95%, 93%)',
            dark: 'hsl(224, 76%, 25%)',
        },
        secondary: {
            main: 'hsl(214, 91%, 60%)',
            light: 'hsl(214, 95%, 93%)',
        },
        background: {
            default: 'hsl(210, 40%, 98%)',
            paper: '#ffffff',
        },
        grey: {
            50: 'hsl(214, 95%, 97%)',
            100: 'hsl(214, 95%, 93%)',
        },
        text: {
            primary: '#334155',
            secondary: '#64748b',
        }
    },
});

const ITEMS_PER_PAGE = 20;

export const CustomerTable: React.FC = () => {
    const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
    const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
    const [filters, setFilters] = useState({
        customerName: '',
        totalNumbers: '',
        totalNumbersOp: '>=',
    });
    const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [expandedAccounts, setExpandedAccounts] = useState<{ [key: number]: boolean }>({});
    const [accountDetails, setAccountDetails] = useState<{ [key: number]: TechAccountDetails[] }>({});
    const [loadingAccount, setLoadingAccount] = useState<{ [key: number]: boolean }>({});
    const [searchQuery, setSearchQuery] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchCustomers(0);
    }, []);

    const fetchCustomers = (pageNum: number, resetData: boolean = false) => {
        if (loading) return;

        setLoading(true);

        const params = new URLSearchParams({
            page: pageNum.toString(),
            size: ITEMS_PER_PAGE.toString()
        });

        if (filters.customerName.trim()) {
            params.append('customerName', filters.customerName.trim());
        }
        if (filters.totalNumbers.trim()) {
            params.append('totalNumbers', filters.totalNumbers.trim());
            params.append('totalNumbersOp', filters.totalNumbersOp);
        }

        fetch(`http://localhost:8080/customer/overview?${params.toString()}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: any) => {
                const normalized: Customer[] = data.content.map((c: any) => ({
                    ...c,
                    proAccounts: c.proAccounts ?? [],
                    proCountries: c.proCountries ?? []
                }));

                if (pageNum === 0 || resetData) {
                    setAllCustomers(normalized);
                    setDisplayedCustomers(normalized);
                } else {
                    setAllCustomers(prev => [...prev, ...normalized]);
                    setDisplayedCustomers(prev => [...prev, ...normalized]);
                }

                setHasMore(!data.last);
                setPage(pageNum);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch customers:", error);
                setLoading(false);
            });
    };

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(0);
        setHasMore(true);
        fetchCustomers(0, true);
    };

    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current || loading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            fetchCustomers(page + 1);
        }
    }, [loading, hasMore, page]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    const handleRowToggle = (customerId: number) => {
        setOpenRows(prev => ({ ...prev, [customerId]: !prev[customerId] }));
    };

    const handleAccountToggle = (techAccountId: number) => {
        setExpandedAccounts(prev => ({ ...prev, [techAccountId]: !prev[techAccountId] }));
    };

    const fetchAccountDetails = (customerName: string, techAccountId: number) => {
        if (accountDetails[techAccountId] && expandedAccounts[techAccountId]) {
            handleAccountToggle(techAccountId);
            return;
        }

        if (loadingAccount[techAccountId]) return;

        setLoadingAccount(prev => ({ ...prev, [techAccountId]: true }));

        const url = `http://localhost:8080/customer/overview/${encodeURIComponent(customerName)}/${techAccountId}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<TechAccountDetails[]>;
            })
            .then((data: TechAccountDetails[]) => {
                setAccountDetails(prev => ({ ...prev, [techAccountId]: data }));
                handleAccountToggle(techAccountId);
            })
            .catch(err => {
                console.error("Ошибка при получении деталей аккаунта:", err);
                handleAccountToggle(techAccountId);
            })
            .finally(() =>
                setLoadingAccount(prev => ({ ...prev, [techAccountId]: false }))
            );
    };

    const isVoiceInProduct = (productType: string) => {
        return productType.toLowerCase().includes('voice in');
    };

    const ProductTypeCell: React.FC<{ productType: string }> = ({ productType }) => {
        if (isVoiceInProduct(productType)) {
            return (
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '16px',
                        backgroundColor: alpha(calmTheme.palette.primary.main, 0.15),
                        color: calmTheme.palette.primary.main,
                        border: `1px solid ${alpha(calmTheme.palette.primary.main, 0.3)}`,
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {productType}
                    </Typography>
                </Box>
            );
        }
        return (
            <Typography variant="body2" fontWeight="500" color="text.secondary">
                {productType}
            </Typography>
        );
    };

    const TechAccountStatusChip: React.FC<{ status: string }> = ({ status }) => {
        const color =
            status.toLowerCase() === 'active'
                ? 'success'
                : status.toLowerCase() === 'suspended'
                    ? 'error'
                    : status.toLowerCase() === 'unknown status'
                        ? 'default'
                        : 'info';
        return <Chip label={status} color={color as any} size="small" />;
    };

    const filterNumbersBySearch = (techAccountId: number) => {
        const numbers = accountDetails[techAccountId] || [];
        const query = searchQuery[techAccountId]?.toLowerCase() || '';

        if (!query) {
            return numbers;
        }

        return numbers.filter(detail =>
            detail.number.toLowerCase().includes(query)
        );
    };

    return (
        <ThemeProvider theme={calmTheme}>
            <Card elevation={6} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, maxWidth: '100vw' }}>
                <Paper elevation={3} sx={{ p: 2.5, mb: 3, borderRadius: 2.5 }}>
                    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
                        <Typography variant="subtitle2" sx={{ minWidth: '100px', fontWeight: 600 }}>
                            Filter by:
                        </Typography>
                        <TextField
                            label="Customer Name"
                            value={filters.customerName}
                            onChange={e => handleFilterChange('customerName', e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 220 }}
                        />
                        <Box display="flex" alignItems="center" gap={1}>
                            <Select
                                value={filters.totalNumbersOp}
                                onChange={e => handleFilterChange('totalNumbersOp', e.target.value as string)}
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 70 }}
                            >
                                <MenuItem value=">=">&ge;</MenuItem>
                                <MenuItem value="<=">&le;</MenuItem>
                            </Select>
                            <TextField
                                label="Total Numbers"
                                value={filters.totalNumbers}
                                onChange={e => handleFilterChange('totalNumbers', e.target.value)}
                                variant="outlined"
                                size="small"
                                type="number"
                                sx={{ minWidth: 150 }}
                            />
                        </Box>
                    </Box>
                </Paper>

                <Paper elevation={4} sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
                    <Box ref={scrollContainerRef} sx={{ maxHeight: '70vh', overflowY: 'auto', position: 'relative' }}>
                        <Table sx={{ minWidth: 750 }} aria-label="customers table">
                            <TableHead>
                                <TableRow>
                                    {['', 'Customer Name', 'Product Type', 'Total Numbers', 'Accounts', 'Countries']
                                        .map((title, idx) => (
                                            <TableCell key={idx} sx={{ fontWeight: '700' }}>
                                                {title}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedCustomers.length > 0 ? (
                                    displayedCustomers.map(customer => (
                                        <React.Fragment key={customer.customerId}>
                                            <TableRow hover>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="expand row"
                                                        size="small"
                                                        onClick={() => handleRowToggle(customer.customerId)}
                                                    >
                                                        {openRows[customer.customerId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>{customer.customerName}</TableCell>
                                                <TableCell><ProductTypeCell productType={customer.productType} /></TableCell>
                                                <TableCell>{new Intl.NumberFormat().format(customer.totalNumbers)}</TableCell>
                                                <TableCell>{customer.proAccounts.length}</TableCell>
                                                <TableCell>{customer.proCountries.length}</TableCell>
                                            </TableRow>
                                            {/* Expand Customer */}
                                            <TableRow>
                                                <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                                    <Collapse in={openRows[customer.customerId]} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 2 }}>
                                                            {/* Accounts */}
                                                            <Typography variant="h6" gutterBottom>Accounts</Typography>
                                                            <Paper elevation={2}>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>ID</TableCell>
                                                                            <TableCell>Name</TableCell>
                                                                            <TableCell>Status</TableCell>
                                                                            <TableCell>Total Numbers</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {customer.proAccounts.length > 0 ? (
                                                                            customer.proAccounts.map(acc => (
                                                                                <React.Fragment key={acc.techAccountId}>
                                                                                    <TableRow
                                                                                        hover
                                                                                        onClick={() => fetchAccountDetails(customer.customerName, acc.techAccountId)}
                                                                                        sx={{ cursor: 'pointer' }}
                                                                                    >
                                                                                        <TableCell>{acc.techAccountId}</TableCell>
                                                                                        <TableCell>{acc.techAccountName}</TableCell>
                                                                                        <TableCell><TechAccountStatusChip status={acc.techAccountStatus} /></TableCell>
                                                                                        <TableCell>{new Intl.NumberFormat().format(acc.totalNumbers)}</TableCell>
                                                                                    </TableRow>
                                                                                    {/* Expand Account Details */}
                                                                                    <TableRow>
                                                                                        <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                                                                            <Collapse in={expandedAccounts[acc.techAccountId]} timeout="auto" unmountOnExit>
                                                                                                <Box margin={1}>
                                                                                                    <Box sx={{ mb: 2 }}>
                                                                                                        <TextField
                                                                                                            label="Search Number"
                                                                                                            variant="outlined"
                                                                                                            size="small"
                                                                                                            value={searchQuery[acc.techAccountId] || ''}
                                                                                                            onChange={(e) => setSearchQuery(prev => ({
                                                                                                                ...prev,
                                                                                                                [acc.techAccountId]: e.target.value
                                                                                                            }))}
                                                                                                            fullWidth
                                                                                                        />
                                                                                                    </Box>

                                                                                                    {loadingAccount[acc.techAccountId] && (
                                                                                                        <Typography variant="body2" color="textSecondary">Loading...</Typography>
                                                                                                    )}
                                                                                                    {!loadingAccount[acc.techAccountId] && accountDetails[acc.techAccountId] && (
                                                                                                        <Paper elevation={1} sx={{ mt: 2 }}>
                                                                                                            <Table size="small">
                                                                                                                <TableHead>
                                                                                                                    <TableRow>
                                                                                                                        <TableCell>Start Date</TableCell>
                                                                                                                        <TableCell>End Date</TableCell>
                                                                                                                        <TableCell>Number</TableCell>
                                                                                                                        <TableCell>Comment</TableCell>
                                                                                                                        <TableCell>Provider</TableCell>
                                                                                                                        <TableCell>Service Detail</TableCell>
                                                                                                                    </TableRow>
                                                                                                                </TableHead>
                                                                                                                <TableBody>
                                                                                                                    {filterNumbersBySearch(acc.techAccountId).length > 0 ? (
                                                                                                                        filterNumbersBySearch(acc.techAccountId).map((detail, idx) => (
                                                                                                                            <TableRow key={idx} hover>
                                                                                                                                <TableCell>{detail.startDate}</TableCell>
                                                                                                                                <TableCell>{detail.endDate}</TableCell>
                                                                                                                                <TableCell>{detail.number}</TableCell>
                                                                                                                                <TableCell>{detail.comment ?? '-'}</TableCell>
                                                                                                                                <TableCell>{detail.numberProviderName}</TableCell>
                                                                                                                                <TableCell>{detail.serviceDetail}</TableCell>
                                                                                                                            </TableRow>
                                                                                                                        ))
                                                                                                                    ) : (
                                                                                                                        <TableRow>
                                                                                                                            <TableCell colSpan={6} align="center">No numbers match the search query</TableCell>
                                                                                                                        </TableRow>
                                                                                                                    )}
                                                                                                                </TableBody>
                                                                                                            </Table>
                                                                                                        </Paper>
                                                                                                    )}
                                                                                                </Box>
                                                                                            </Collapse>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                </React.Fragment>
                                                                            ))
                                                                        ) : (
                                                                            <TableRow><TableCell colSpan={4} align="center">No accounts found</TableCell></TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </Paper>

                                                            {/* Countries */}
                                                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Countries</Typography>
                                                            <Paper elevation={2}>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>ID</TableCell>
                                                                            <TableCell>Name</TableCell>
                                                                            <TableCell>Total Accounts</TableCell>
                                                                            <TableCell>Total Numbers</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {customer.proCountries.length > 0 ? (
                                                                            customer.proCountries.map(country => (
                                                                                <TableRow key={country.countryId} hover>
                                                                                    <TableCell>{country.countryId}</TableCell>
                                                                                    <TableCell>{country.countryName}</TableCell>
                                                                                    <TableCell>{country.totalAccounts}</TableCell>
                                                                                    <TableCell>{new Intl.NumberFormat().format(country.totalNumbers)}</TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                        ) : (
                                                                            <TableRow><TableCell colSpan={4} align="center">No countries found</TableCell></TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </Paper>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                            {loading ? "Loading customer data..." : "No customers found"}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {loading && (
                            <Box display="flex" justifyContent="center" my={2}><CircularProgress /></Box>
                        )}
                    </Box>
                </Paper>
            </Card>
        </ThemeProvider>
    );
};