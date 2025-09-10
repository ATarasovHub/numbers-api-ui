import React, {useEffect, useState, useRef, useCallback} from 'react';
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
    productType?: string | null;
    totalNumbers: number;
    proAccounts: CustomerOverviewProAccount[];
    proCountries: CustomerOverviewProCountry[];
}

export interface TechAccountDetails {
    startDate?: string | null;
    endDate?: string | null;
    number: string;
    comment?: string | null;
    numberProviderName: string;
    serviceDetail: string;
}

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
const ACCOUNT_DETAILS_PAGE_SIZE = 20;

function debounce<A extends any[], R>(
    func: (...args: A) => R,
    wait: number
) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: A): void => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), wait);
    };
}

export const CustomerTable: React.FC = () => {
    const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
    const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
    const [filters, setFilters] = useState({
        customerName: '',
        totalNumbers: '',
        totalNumbersOp: '>='
    });
    const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const [expandedAccounts, setExpandedAccounts] = useState<{ [key: number]: boolean }>({});
    const [accountDetails, setAccountDetails] = useState<{ [key: number]: TechAccountDetails[] }>({});
    const [loadingAccount, setLoadingAccount] = useState<{ [key: number]: boolean }>({});
    const [searchQuery, setSearchQuery] = useState<{ [key: number]: string }>({});
    const [accountDetailsPage, setAccountDetailsPage] = useState<{ [key: number]: number }>({});
    const [accountDetailsHasMore, setAccountDetailsHasMore] = useState<{ [key: number]: boolean }>({});
    const accountDetailsScrollRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const [accountDetailsScrollTop, setAccountDetailsScrollTop] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        fetchCustomers(0, true);
    }, []);

    const fetchCustomers = useCallback((pageNum: number, resetData = false) => {
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
            if (!isNaN(Number(filters.totalNumbers))) {
                params.append('totalNumbers', filters.totalNumbers.trim());
                params.append('totalNumbersOp', filters.totalNumbersOp);
            }
        }

        fetch(`http://localhost:8080/customer/overview?${params.toString()}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: any) => {
                const normalized: Customer[] = data.content.map((c: any) => ({
                    ...c,
                    productType: c.productType ?? '-',
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
    }, [filters.customerName, filters.totalNumbers, filters.totalNumbersOp, loading]); // Зависимости для useCallback

    const debouncedFetchCustomers = useCallback(debounce(fetchCustomers, 350), [fetchCustomers]);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({...prev, [field]: value}));
        setPage(0);
        setHasMore(true);

        if (field === 'customerName') {
            debouncedFetchCustomers(0, true);
        } else {
            fetchCustomers(0, true);
        }
    };

    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current || loading || !hasMore) return;

        const {scrollTop, scrollHeight, clientHeight} = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            fetchCustomers(page + 1);
        }
    }, [loading, hasMore, page, fetchCustomers]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    const handleRowToggle = (customerId: number) => {
        setOpenRows(prev => ({...prev, [customerId]: !prev[customerId]}));
    };

    const handleAccountToggle = (techAccountId: number) => {
        setExpandedAccounts(prev => ({...prev, [techAccountId]: !prev[techAccountId]}));
    };

    const fetchAccountDetails = useCallback((customerName: string, techAccountId: number, pageNum: number = 0) => {
        if (pageNum === 0 && accountDetails[techAccountId] && expandedAccounts[techAccountId]) {
            handleAccountToggle(techAccountId);
            return;
        }

        if (loadingAccount[techAccountId]) return;

        const currentScrollTop = accountDetailsScrollRefs.current[techAccountId]?.scrollTop || 0;
        setAccountDetailsScrollTop(prev => ({...prev, [techAccountId]: currentScrollTop}));

        setLoadingAccount(prev => ({...prev, [techAccountId]: true}));

        const url = `http://localhost:8080/customer/overview/${encodeURIComponent(customerName)}/${techAccountId}?page=${pageNum}&size=${ACCOUNT_DETAILS_PAGE_SIZE}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((response: any) => {
                const newDetails: TechAccountDetails[] = response.content;
                const isLastPage = response.last;

                setAccountDetails(prev => ({
                    ...prev,
                    [techAccountId]: pageNum === 0 ? newDetails : [...(prev[techAccountId] || []), ...newDetails]
                }));

                setAccountDetailsPage(prev => ({...prev, [techAccountId]: pageNum}));
                setAccountDetailsHasMore(prev => ({...prev, [techAccountId]: !isLastPage}));

                if (pageNum === 0 && !expandedAccounts[techAccountId]) {
                    handleAccountToggle(techAccountId);
                }
            })
            .catch(err => {
                console.error(`Error loading account details ${techAccountId}:`, err);
                if (pageNum === 0 && !expandedAccounts[techAccountId]) {
                    handleAccountToggle(techAccountId);
                }
            })
            .finally(() => {
                setLoadingAccount(prev => ({...prev, [techAccountId]: false}));
            });
    }, [loadingAccount, expandedAccounts, accountDetails]);

    const isVoiceInProduct = (productType: string) => {
        return productType?.toLowerCase().includes('voice in');
    };

    const ProductTypeCell: React.FC<{ productType?: string | null }> = ({productType}) => {
        if (productType && isVoiceInProduct(productType)) {
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
                    <Typography variant="body2" sx={{fontWeight: 600, fontSize: '0.95rem'}}>
                        {productType}
                    </Typography>
                </Box>
            );
        }
        return (
            <Typography variant="body2" fontWeight="500" color="text.secondary">
                {productType ?? '-'}
            </Typography>
        );
    };

    const TechAccountStatusChip: React.FC<{ status: string }> = ({status}) => {
        const color =
            status.toLowerCase() === 'active'
                ? 'success'
                : status.toLowerCase() === 'suspended'
                    ? 'error'
                    : status.toLowerCase() === 'unknown status'
                        ? 'default'
                        : 'info';
        return <Chip label={status} color={color as any} size="small"/>;
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

    const handleAccountDetailsScroll = useCallback((customerName: string, techAccountId: number) => {
        return () => {
            const container = accountDetailsScrollRefs.current[techAccountId];
            if (!container || loadingAccount[techAccountId] || !accountDetailsHasMore[techAccountId]) return;

            const {scrollTop, scrollHeight, clientHeight} = container;
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                const nextPage = (accountDetailsPage[techAccountId] || 0) + 1;
                fetchAccountDetails(customerName, techAccountId, nextPage);
            }
        };
    }, [loadingAccount, accountDetailsHasMore, accountDetailsPage, fetchAccountDetails, accountDetails]); // Добавлены accountDetails как зависимость, т.к. fetchAccountDetails ее использует

    useEffect(() => {
        Object.keys(accountDetails).forEach(techAccountIdStr => {
            const techAccountId = Number(techAccountIdStr);
            const container = accountDetailsScrollRefs.current[techAccountId];

            if (container && accountDetailsScrollTop[techAccountId] !== undefined) {
                container.scrollTop = accountDetailsScrollTop[techAccountId];
            }
        });
    }, [accountDetails, accountDetailsScrollTop]);

    return (
        <ThemeProvider theme={calmTheme}>
            <Card elevation={6} sx={{p: {xs: 2, sm: 3}, borderRadius: 3, maxWidth: '100vw'}}>
                <Paper elevation={3} sx={{p: 2.5, mb: 3, borderRadius: 2.5}}>
                    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
                        <Typography variant="subtitle2" sx={{minWidth: '100px', fontWeight: 600}}>
                            Filter by:
                        </Typography>
                        <TextField
                            label="Customer Name"
                            value={filters.customerName}
                            onChange={e => handleFilterChange('customerName', e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{minWidth: 220}}
                        />
                        <Box display="flex" alignItems="center" gap={1}>
                            <Select
                                value={filters.totalNumbersOp}
                                onChange={e => handleFilterChange('totalNumbersOp', e.target.value as string)}
                                variant="outlined"
                                size="small"
                                sx={{minWidth: 70}}
                            >
                                <MenuItem value=">=">&ge;</MenuItem>
                                <MenuItem value="<=">&le;</MenuItem>
                            </Select>
                            <TextField
                                label="Total Numbers"
                                value={filters.totalNumbers}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) {
                                        handleFilterChange('totalNumbers', val);
                                    }
                                }}
                                variant="outlined"
                                size="small"
                                type="text"
                                sx={{minWidth: 150}}
                            />
                        </Box>
                    </Box>
                </Paper>

                <Paper elevation={4} sx={{borderRadius: 2.5, overflow: 'hidden'}}>
                    <Box ref={scrollContainerRef} sx={{maxHeight: '70vh', overflowY: 'auto', position: 'relative'}}>
                        <Table sx={{minWidth: 750}} aria-label="customers table">
                            <TableHead>
                                <TableRow>
                                    {['', 'Customer Name', 'Product Type', 'Total Numbers', 'Accounts', 'Countries']
                                        .map((title, idx) => (
                                            <TableCell key={idx} sx={{fontWeight: '700'}}>
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
                                                        {openRows[customer.customerId] ? <KeyboardArrowUpIcon/> :
                                                            <KeyboardArrowDownIcon/>}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>{customer.customerName}</TableCell>
                                                <TableCell><ProductTypeCell
                                                    productType={customer.productType}/></TableCell>
                                                <TableCell>{new Intl.NumberFormat().format(customer.totalNumbers)}</TableCell>
                                                <TableCell>{customer.proAccounts.length}</TableCell>
                                                <TableCell>{customer.proCountries.length}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={6} style={{
                                                    paddingBottom: 0,
                                                    paddingTop: 0,
                                                    borderBottom: 'none'
                                                }}>
                                                    <Collapse in={openRows[customer.customerId]} timeout="auto"
                                                              unmountOnExit>
                                                        <Box sx={{
                                                            margin: 2,
                                                            border: '1px solid #e0e0e0',
                                                            borderRadius: 2,
                                                            p: 2
                                                        }}>
                                                            <Typography variant="h6" gutterBottom>Accounts</Typography>
                                                            <Paper elevation={2} sx={{mb: 3}}>
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
                                                                                        onClick={() => {
                                                                                            if (!accountDetails[acc.techAccountId] || !expandedAccounts[acc.techAccountId]) {
                                                                                                fetchAccountDetails(customer.customerName, acc.techAccountId, 0);
                                                                                            } else {
                                                                                                handleAccountToggle(acc.techAccountId);
                                                                                            }
                                                                                        }}
                                                                                        sx={{cursor: 'pointer'}}
                                                                                    >
                                                                                        <TableCell>{acc.techAccountId}</TableCell>
                                                                                        <TableCell>{acc.techAccountName}</TableCell>
                                                                                        <TableCell><TechAccountStatusChip
                                                                                            status={acc.techAccountStatus}/></TableCell>
                                                                                        <TableCell>{new Intl.NumberFormat().format(acc.totalNumbers)}</TableCell>
                                                                                    </TableRow>
                                                                                    <TableRow>
                                                                                        <TableCell colSpan={4} style={{
                                                                                            paddingBottom: 0,
                                                                                            paddingTop: 0,
                                                                                            borderBottom: 'none'
                                                                                        }}>
                                                                                            <Collapse
                                                                                                in={expandedAccounts[acc.techAccountId]}
                                                                                                timeout="auto"
                                                                                                unmountOnExit>
                                                                                                <Box margin={1}>
                                                                                                    <Box sx={{mb: 2}}>
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
                                                                                                        <Box sx={{
                                                                                                            display: 'flex',
                                                                                                            justifyContent: 'center',
                                                                                                            py: 3
                                                                                                        }}>
                                                                                                            <CircularProgress
                                                                                                                size={24}/>
                                                                                                        </Box>
                                                                                                    )}
                                                                                                    {!loadingAccount[acc.techAccountId] && accountDetails[acc.techAccountId] && (
                                                                                                        <Box
                                                                                                            ref={(el: HTMLDivElement | null) => {
                                                                                                                accountDetailsScrollRefs.current[acc.techAccountId] = el;
                                                                                                            }}
                                                                                                            onScroll={handleAccountDetailsScroll(customer.customerName, acc.techAccountId)}
                                                                                                            sx={{
                                                                                                                maxHeight: '400px',
                                                                                                                overflowY: 'auto',
                                                                                                                border: '1px solid #eee',
                                                                                                                borderRadius: 1.5
                                                                                                            }}
                                                                                                        >
                                                                                                            <Paper
                                                                                                                elevation={1}
                                                                                                                sx={{mt: 0}}>
                                                                                                                <Table
                                                                                                                    size="small">
                                                                                                                    <TableHead>
                                                                                                                        <TableRow>
                                                                                                                            <TableCell>Start
                                                                                                                                Date</TableCell>
                                                                                                                            <TableCell>End
                                                                                                                                Date</TableCell>
                                                                                                                            <TableCell>Number</TableCell>
                                                                                                                            <TableCell>Comment</TableCell>
                                                                                                                            <TableCell>Provider</TableCell>
                                                                                                                            <TableCell>Service
                                                                                                                                Detail</TableCell>
                                                                                                                        </TableRow>
                                                                                                                    </TableHead>
                                                                                                                    <TableBody>
                                                                                                                        {filterNumbersBySearch(acc.techAccountId).length > 0 ? (
                                                                                                                            filterNumbersBySearch(acc.techAccountId).map((detail, idx) => (
                                                                                                                                <TableRow
                                                                                                                                    key={idx}
                                                                                                                                    hover>
                                                                                                                                    <TableCell>{detail.startDate ?? '-'}</TableCell>
                                                                                                                                    <TableCell>{detail.endDate ?? '-'}</TableCell>
                                                                                                                                    <TableCell>{detail.number}</TableCell>
                                                                                                                                    <TableCell>{detail.comment ?? '-'}</TableCell>
                                                                                                                                    <TableCell>{detail.numberProviderName}</TableCell>
                                                                                                                                    <TableCell>{detail.serviceDetail}</TableCell>
                                                                                                                                </TableRow>
                                                                                                                            ))
                                                                                                                        ) : (
                                                                                                                            <TableRow>
                                                                                                                                <TableCell
                                                                                                                                    colSpan={6}
                                                                                                                                    align="center">No
                                                                                                                                    numbers
                                                                                                                                    match
                                                                                                                                    the
                                                                                                                                    search
                                                                                                                                    query</TableCell>
                                                                                                                            </TableRow>
                                                                                                                        )}
                                                                                                                    </TableBody>
                                                                                                                </Table>
                                                                                                            </Paper>
                                                                                                        </Box>
                                                                                                    )}
                                                                                                    {!loadingAccount[acc.techAccountId] && !accountDetails[acc.techAccountId] && (
                                                                                                        <Typography
                                                                                                            variant="body2"
                                                                                                            color="text.secondary"
                                                                                                            sx={{
                                                                                                                textAlign: 'center',
                                                                                                                py: 3
                                                                                                            }}>
                                                                                                            Failed to
                                                                                                            load account
                                                                                                            details.
                                                                                                        </Typography>
                                                                                                    )}
                                                                                                </Box>
                                                                                            </Collapse>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                </React.Fragment>
                                                                            ))
                                                                        ) : (
                                                                            <TableRow><TableCell colSpan={4}
                                                                                                 align="center">No
                                                                                accounts found</TableCell></TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </Paper>

                                                            <Typography variant="h6" gutterBottom
                                                                        sx={{mt: 3}}>Countries</Typography>
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
                                                                                    <TableCell>{new Intl.NumberFormat().format(country.totalAccounts)}</TableCell>
                                                                                    <TableCell>{new Intl.NumberFormat().format(country.totalNumbers)}</TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                        ) : (
                                                                            <TableRow><TableCell colSpan={4}
                                                                                                 align="center">No
                                                                                countries found</TableCell></TableRow>
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
                                    loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <CircularProgress/>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">No customers found matching your
                                                criteria.</TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                        {loading && displayedCustomers.length > 0 && (
                            <Box sx={{display: 'flex', justifyContent: 'center', py: 2}}>
                                <CircularProgress size={24}/>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Card>
        </ThemeProvider>
    );
};