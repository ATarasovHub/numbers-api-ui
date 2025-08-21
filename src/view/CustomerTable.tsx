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
    CircularProgress
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export interface Customer {
    customerId: number;
    customerName: string;
    productType: string;
    totalNumbers: number;
    proAccounts: CustomerOverviewProAccount[];
    proCountry: CustomerOverviewProCountry[];
}

export interface CustomerOverviewProAccount {
    techAccountId: number;
    techAccountName: string;
    totalAccounts: number;
    totalNumbers: number;
}

export interface CustomerOverviewProCountry {
    countryId: number;
    countryName: string;
    totalAccounts: number;
    totalNumbers: number;
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
                const normalized = data.content.map((c: any) => ({
                    ...c,
                    proAccounts: c.proAccounts ?? [],
                    proCountry: c.proCountry ?? []
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
        fetchCustomers(0);
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
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.95rem'
                        }}
                    >
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

    return (
        <ThemeProvider theme={calmTheme}>
            <Card
                elevation={6}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    maxWidth: '100vw',
                    background: `linear-gradient(135deg, ${alpha(calmTheme.palette.primary.main, 0.05)} 0%, ${alpha(calmTheme.palette.secondary.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(calmTheme.palette.primary.main, 0.1)}`,
                    boxShadow: `0 10px 30px ${alpha(calmTheme.palette.common.black, 0.08)}`
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                    sx={{
                        pb: 2,
                        borderBottom: `2px solid ${alpha(calmTheme.palette.primary.main, 0.2)}`
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        fontWeight="800"
                        color="primary"
                        sx={{
                            background: `linear-gradient(45deg, ${calmTheme.palette.primary.main}, ${calmTheme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Customer Overview
                    </Typography>
                </Box>
                <Paper
                    elevation={3}
                    sx={{
                        p: 2.5,
                        mb: 3,
                        borderRadius: 2.5,
                        backgroundColor: alpha(calmTheme.palette.background.paper, 0.7),
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(calmTheme.palette.primary.main, 0.15)}`
                    }}
                >
                    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
                        <Typography variant="subtitle2" sx={{ minWidth: '100px', fontWeight: 600 }}>Filter by:</Typography>
                        <TextField
                            label="Customer Name"
                            value={filters.customerName}
                            onChange={e => handleFilterChange('customerName', e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{
                                minWidth: 220,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.3),
                                    },
                                    '&:hover fieldset': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.5),
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: calmTheme.palette.primary.main,
                                    },
                                },
                            }}
                        />
                        <Box display="flex" alignItems="center" gap={1}>
                            <Select
                                value={filters.totalNumbersOp}
                                onChange={e => handleFilterChange('totalNumbersOp', e.target.value as string)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    minWidth: 70,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.3),
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(calmTheme.palette.primary.main, 0.5),
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: calmTheme.palette.primary.main,
                                    },
                                }}
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
                                sx={{
                                    minWidth: 150,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: alpha(calmTheme.palette.primary.main, 0.3),
                                        },
                                        '&:hover fieldset': {
                                            borderColor: alpha(calmTheme.palette.primary.main, 0.5),
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: calmTheme.palette.primary.main,
                                        },
                                    },
                                }}
                                type="number"
                            />
                        </Box>
                    </Box>
                </Paper>
                <Paper
                    elevation={4}
                    sx={{
                        borderRadius: 2.5,
                        overflow: 'hidden',
                        border: `1px solid ${alpha(calmTheme.palette.divider, 0.5)}`,
                        boxShadow: `0 4px 20px ${alpha(calmTheme.palette.common.black, 0.06)}`
                    }}
                >
                    <Box
                        ref={scrollContainerRef}
                        sx={{
                            maxHeight: '70vh',
                            overflowY: 'auto',
                            position: 'relative',
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            }
                        }}
                    >
                        <Table sx={{ minWidth: 750 }} aria-label="customers table">
                            <TableHead>
                                <TableRow>
                                    {['', 'Customer Name', 'Product Type', 'Total Numbers', 'Accounts', 'Countries']
                                        .map((title, idx) => (
                                            <TableCell
                                                key={idx}
                                                sx={{
                                                    position: 'sticky',
                                                    top: 0,
                                                    zIndex: 2,
                                                    fontWeight: '700',
                                                    color: calmTheme.palette.common.white,
                                                    background: calmTheme.palette.primary.dark,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    ...(idx === 0 && { width: '5%' })
                                                }}
                                            >
                                                {title}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedCustomers.length > 0 ? (
                                    displayedCustomers.map((customer, index) => (
                                        <React.Fragment key={customer.customerId}>
                                            <TableRow
                                                sx={{
                                                    backgroundColor: index % 2 === 0 ?
                                                        alpha(calmTheme.palette.grey[50], 0.7) :
                                                        alpha(calmTheme.palette.background.paper, 0.7),
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        backgroundColor: alpha(calmTheme.palette.primary.light, 0.1),
                                                        transform: 'scale(1.005)',
                                                        boxShadow: `inset 0 0 0 1px ${alpha(calmTheme.palette.primary.main, 0.2)}`,
                                                    },
                                                    borderBottom: `1px solid ${alpha(calmTheme.palette.divider, 0.3)}`
                                                }}
                                            >
                                                <TableCell sx={{ width: '5%' }}>
                                                    <IconButton
                                                        aria-label="expand row"
                                                        size="small"
                                                        onClick={() => handleRowToggle(customer.customerId)}
                                                        sx={{
                                                            color: calmTheme.palette.primary.main,
                                                            backgroundColor: alpha(calmTheme.palette.primary.main, 0.1),
                                                            '&:hover': {
                                                                backgroundColor: alpha(calmTheme.palette.primary.main, 0.2),
                                                            },
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {openRows[customer.customerId] ?
                                                            <KeyboardArrowUpIcon /> :
                                                            <KeyboardArrowDownIcon />
                                                        }
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="600" color="text.primary">
                                                        {customer.customerName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <ProductTypeCell productType={customer.productType} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="500" color="text.primary">
                                                        {new Intl.NumberFormat().format(customer.totalNumbers)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="500" color="text.primary">
                                                        {customer.proAccounts.length}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="500" color="text.primary">
                                                        {customer.proCountry.length}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell
                                                    style={{
                                                        paddingBottom: 0,
                                                        paddingTop: 0,
                                                        backgroundColor: alpha(calmTheme.palette.grey[50], 0.5)
                                                    }}
                                                    colSpan={6}
                                                >
                                                    <Collapse
                                                        in={openRows[customer.customerId]}
                                                        timeout="auto"
                                                        unmountOnExit
                                                    >
                                                        <Box sx={{ margin: 3 }}>
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    mb: 2,
                                                                    pb: 1,
                                                                    borderBottom: `1px dashed ${alpha(calmTheme.palette.primary.main, 0.3)}`
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="h6"
                                                                    gutterBottom
                                                                    sx={{
                                                                        color: calmTheme.palette.primary.dark,
                                                                        fontWeight: 700,
                                                                        mr: 1
                                                                    }}
                                                                >
                                                                    Details for
                                                                </Typography>
                                                                <Typography
                                                                    variant="h6"
                                                                    gutterBottom
                                                                    sx={{
                                                                        color: calmTheme.palette.secondary.main,
                                                                        fontWeight: 700
                                                                    }}
                                                                >
                                                                    {customer.customerName}
                                                                </Typography>
                                                            </Box>
                                                            <Typography
                                                                variant="subtitle1"
                                                                gutterBottom
                                                                sx={{
                                                                    fontWeight: '700',
                                                                    color: calmTheme.palette.secondary.main,
                                                                    mb: 1.5,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    '&::before': {
                                                                        content: '" "',
                                                                        display: 'block',
                                                                        width: 12,
                                                                        height: 12,
                                                                        borderRadius: '50%',
                                                                        backgroundColor: calmTheme.palette.secondary.main,
                                                                        marginRight: 1
                                                                    }
                                                                }}
                                                            >
                                                                Accounts
                                                            </Typography>
                                                            <Paper
                                                                elevation={2}
                                                                sx={{
                                                                    mb: 3,
                                                                    borderRadius: 2,
                                                                    overflow: 'hidden',
                                                                    border: `1px solid ${alpha(calmTheme.palette.divider, 0.5)}`
                                                                }}
                                                            >
                                                                <Table size="small">
                                                                    <TableHead sx={{
                                                                        backgroundColor: alpha(calmTheme.palette.secondary.light, 0.2)
                                                                    }}>
                                                                        <TableRow>
                                                                            <TableCell>
                                                                                <Typography variant="subtitle2" fontWeight="500">ID</Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="subtitle2" fontWeight="500">Name</Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="subtitle2" fontWeight="500">Total Accounts</Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="subtitle2" fontWeight="500">Total Numbers</Typography>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {customer.proAccounts.length > 0 ? (
                                                                            customer.proAccounts.map((acc, idx) => (
                                                                                <TableRow
                                                                                    key={`${acc.techAccountId}-${idx}`}
                                                                                    hover
                                                                                    sx={{
                                                                                        backgroundColor: idx % 2 === 0 ?
                                                                                            alpha(calmTheme.palette.grey[100], 0.3) :
                                                                                            'transparent',
                                                                                        '&:hover': {
                                                                                            backgroundColor: alpha(calmTheme.palette.secondary.light, 0.2),
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <TableCell>
                                                                                        <Typography variant="body2" fontWeight="500">
                                                                                            {acc.techAccountId}
                                                                                        </Typography>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Typography variant="body2" fontWeight="500">
                                                                                            {acc.techAccountName}
                                                                                        </Typography>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Typography variant="body2" fontWeight="500">
                                                                                            {acc.totalAccounts}
                                                                                        </Typography>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Typography variant="body2" fontWeight="500">
                                                                                            {new Intl.NumberFormat().format(acc.totalNumbers)}
                                                                                        </Typography>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                        ) : (
                                                                            <TableRow>
                                                                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                                                                    <Typography variant="body2" color="textSecondary">
                                                                                        No accounts found
                                                                                    </Typography>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </Paper>
                                                            <Typography
                                                                variant="subtitle1"
                                                                gutterBottom
                                                                sx={{
                                                                    fontWeight: '700',
                                                                    color: calmTheme.palette.secondary.main,
                                                                    mb: 1.5,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    '&::before': {
                                                                        content: '" "',
                                                                        display: 'block',
                                                                        width: 12,
                                                                        height: 12,
                                                                        borderRadius: '50%',
                                                                        backgroundColor: calmTheme.palette.secondary.main,
                                                                        marginRight: 1
                                                                    }
                                                                }}
                                                            >
                                                                Countries
                                                            </Typography>
                                                            <Paper
                                                                elevation={2}
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    overflow: 'hidden',
                                                                    border: `1px solid ${alpha(calmTheme.palette.divider, 0.5)}`
                                                                }}
                                                            >
                                                                <Table size="small">
                                                                    <TableHead sx={{
                                                                        backgroundColor: alpha(calmTheme.palette.secondary.light, 0.2)
                                                                    }}>
                                                                        <TableRow>
                                                                            <TableCell>
                                                                                <Typography variant="subtitle2" fontWeight="500">ID</Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="subtitle2" fontWeight="500">Name</Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="subtitle2" fontWeight="500">Total Accounts</Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="subtitle2" fontWeight="500">Total Numbers</Typography>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {customer.proCountry.length > 0 ? (
                                                                            customer.proCountry.map((country, idx) => (
                                                                                <TableRow
                                                                                    key={`${country.countryId}-${idx}`}
                                                                                    hover
                                                                                    sx={{
                                                                                        backgroundColor: idx % 2 === 0 ?
                                                                                            alpha(calmTheme.palette.grey[100], 0.3) :
                                                                                            'transparent',
                                                                                        '&:hover': {
                                                                                            backgroundColor: alpha(calmTheme.palette.secondary.light, 0.2),
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <TableCell>
                                                                                        <Typography variant="body2" fontWeight="500">
                                                                                            {country.countryId}
                                                                                        </Typography>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Typography variant="body2" fontWeight="500">
                                                                                            {country.countryName}
                                                                                        </Typography>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Typography variant="body2" fontWeight="500">
                                                                                            {country.totalAccounts}
                                                                                        </Typography>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Typography variant="body2" fontWeight="500">
                                                                                            {new Intl.NumberFormat().format(country.totalNumbers)}
                                                                                        </Typography>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                        ) : (
                                                                            <TableRow>
                                                                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                                                                    <Typography variant="body2" color="textSecondary">
                                                                                        No countries found
                                                                                    </Typography>
                                                                                </TableCell>
                                                                            </TableRow>
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
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: calmTheme.palette.text.secondary,
                                                    fontWeight: 500
                                                }}
                                            >
                                                {loading ? "Loading customer data..." : "No customers found"}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {loading && (
                            <Box display="flex" justifyContent="center" my={2}>
                                <CircularProgress />
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Card>
        </ThemeProvider>
    );
};

export default CustomerTable;
