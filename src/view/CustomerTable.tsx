import React, { useEffect, useState } from 'react';
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
    useTheme
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

export const CustomerTable: React.FC = () => {
    const theme = useTheme();
    const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
    const [filters, setFilters] = useState({
        customerName: '',
        totalNumbers: '',
        totalNumbersOp: '>=',
    });
    const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        fetch('/customer/overview')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: Customer[]) => {
                setAllCustomers(data);
                setDisplayedCustomers(data.slice(0, 10));
            })
            .catch((error) => {
                console.error("Failed to fetch customers:", error);
                setAllCustomers([]);
                setDisplayedCustomers([]);
            });
    }, []);

    useEffect(() => {
        const isAllFiltersEmpty = !filters.customerName && !filters.totalNumbers;
        if (isAllFiltersEmpty) {
            setFilteredCustomers([]);
            setDisplayedCustomers(allCustomers.slice(0, 10));
            return;
        }
        let filtered = allCustomers.filter(customer => {
            let pass = true;
            if (filters.customerName && !customer.customerName.toLowerCase().includes(filters.customerName.toLowerCase())) {
                pass = false;
            }
            if (filters.totalNumbers) {
                const val = Number(filters.totalNumbers);
                if (filters.totalNumbersOp === '>=') pass = pass && (customer.totalNumbers >= val);
                if (filters.totalNumbersOp === '<=') pass = pass && (customer.totalNumbers <= val);
            }
            return pass;
        });
        setFilteredCustomers(filtered);
        setDisplayedCustomers(filtered);
    }, [allCustomers, filters]);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleRowToggle = (customerId: number) => {
        setOpenRows(prev => ({ ...prev, [customerId]: !prev[customerId] }));
    };

    return (
        <Card
            elevation={6}
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                maxWidth: '100vw',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.08)}`
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                sx={{
                    pb: 2,
                    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="800"
                    color="primary"
                    sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`
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
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                },
                                '&:hover fieldset': {
                                    borderColor: alpha(theme.palette.primary.main, 0.5),
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
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
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(theme.palette.primary.main, 0.5),
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main,
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
                                        borderColor: alpha(theme.palette.primary.main, 0.3),
                                    },
                                    '&:hover fieldset': {
                                        borderColor: alpha(theme.palette.primary.main, 0.5),
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main,
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
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.06)}`
                }}
            >
                <Table sx={{ minWidth: 750 }} aria-label="customers table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                fontWeight: '700',
                                color: theme.palette.common.white,
                                background: theme.palette.primary.dark,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                width: '5%'
                            }} />
                            <TableCell sx={{
                                fontWeight: '700',
                                color: theme.palette.common.white,
                                background: theme.palette.primary.dark,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Customer Name</TableCell>
                            <TableCell sx={{
                                fontWeight: '700',
                                color: theme.palette.common.white,
                                background: theme.palette.primary.dark,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Product Type</TableCell>
                            <TableCell sx={{
                                fontWeight: '700',
                                color: theme.palette.common.white,
                                background: theme.palette.primary.dark,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Total Numbers</TableCell>
                            <TableCell sx={{
                                fontWeight: '700',
                                color: theme.palette.common.white,
                                background: theme.palette.primary.dark,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Accounts</TableCell>
                            <TableCell sx={{
                                fontWeight: '700',
                                color: theme.palette.common.white,
                                background: theme.palette.primary.dark,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Countries</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedCustomers.length > 0 ? (
                            displayedCustomers.map((customer, index) => (
                                <React.Fragment key={customer.customerId}>
                                    <TableRow
                                        sx={{
                                            backgroundColor: index % 2 === 0 ?
                                                alpha(theme.palette.grey[50], 0.7) :
                                                alpha(theme.palette.background.paper, 0.7),
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.light, 0.1),
                                                transform: 'scale(1.005)',
                                                boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
                                            },
                                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`
                                        }}
                                    >
                                        <TableCell sx={{ width: '5%' }}>
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => handleRowToggle(customer.customerId)}
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
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
                                            <Typography variant="body2" fontWeight="500" color="text.secondary">
                                                {customer.productType}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight="700"
                                                color="primary"
                                                sx={{ fontSize: '1.1rem' }}
                                            >
                                                {customer.totalNumbers}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="500">
                                                {customer.proAccounts.length}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="500">
                                                {customer.proCountry.length}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell
                                            style={{
                                                paddingBottom: 0,
                                                paddingTop: 0,
                                                backgroundColor: alpha(theme.palette.grey[50], 0.5)
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
                                                            borderBottom: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="h6"
                                                            gutterBottom
                                                            sx={{
                                                                color: theme.palette.primary.dark,
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
                                                                color: theme.palette.secondary.main,
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
                                                            color: theme.palette.secondary.main,
                                                            mb: 1.5,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            '&::before': {
                                                                content: '" "',
                                                                display: 'block',
                                                                width: 12,
                                                                height: 12,
                                                                borderRadius: '50%',
                                                                backgroundColor: theme.palette.secondary.main,
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
                                                            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                                                        }}
                                                    >
                                                        <Table size="small">
                                                            <TableHead sx={{
                                                                backgroundColor: alpha(theme.palette.secondary.light, 0.2)
                                                            }}>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <Typography variant="subtitle2" fontWeight="700">ID</Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography variant="subtitle2" fontWeight="700">Name</Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography variant="subtitle2" fontWeight="700">Total Accounts</Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography variant="subtitle2" fontWeight="700">Total Numbers</Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {customer.proAccounts.length > 0 ? (
                                                                    customer.proAccounts.map((acc, idx) => (
                                                                        <TableRow
                                                                            key={acc.techAccountId}
                                                                            hover
                                                                            sx={{
                                                                                backgroundColor: idx % 2 === 0 ?
                                                                                    alpha(theme.palette.grey[100], 0.3) :
                                                                                    'transparent',
                                                                                '&:hover': {
                                                                                    backgroundColor: alpha(theme.palette.secondary.light, 0.2),
                                                                                }
                                                                            }}
                                                                        >
                                                                            <TableCell>
                                                                                <Typography variant="body2" fontWeight="500">
                                                                                    {acc.techAccountId}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="body2">
                                                                                    {acc.techAccountName}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="body2" fontWeight="500">
                                                                                    {acc.totalAccounts}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography
                                                                                    variant="body2"
                                                                                    fontWeight="600"
                                                                                    color="secondary"
                                                                                >
                                                                                    {acc.totalNumbers}
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
                                                            color: theme.palette.secondary.main,
                                                            mb: 1.5,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            '&::before': {
                                                                content: '" "',
                                                                display: 'block',
                                                                width: 12,
                                                                height: 12,
                                                                borderRadius: '50%',
                                                                backgroundColor: theme.palette.secondary.main,
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
                                                            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                                                        }}
                                                    >
                                                        <Table size="small">
                                                            <TableHead sx={{
                                                                backgroundColor: alpha(theme.palette.secondary.light, 0.2)
                                                            }}>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <Typography variant="subtitle2" fontWeight="700">ID</Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography variant="subtitle2" fontWeight="700">Name</Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography variant="subtitle2" fontWeight="700">Total Accounts</Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography variant="subtitle2" fontWeight="700">Total Numbers</Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {customer.proCountry.length > 0 ? (
                                                                    customer.proCountry.map((country, idx) => (
                                                                        <TableRow
                                                                            key={country.countryId}
                                                                            hover
                                                                            sx={{
                                                                                backgroundColor: idx % 2 === 0 ?
                                                                                    alpha(theme.palette.grey[100], 0.3) :
                                                                                    'transparent',
                                                                                '&:hover': {
                                                                                    backgroundColor: alpha(theme.palette.secondary.light, 0.2),
                                                                                }
                                                                            }}
                                                                        >
                                                                            <TableCell>
                                                                                <Typography variant="body2" fontWeight="500">
                                                                                    {country.countryId}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="body2">
                                                                                    {country.countryName}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="body2" fontWeight="500">
                                                                                    {country.totalAccounts}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography
                                                                                    variant="body2"
                                                                                    fontWeight="600"
                                                                                    color="secondary"
                                                                                >
                                                                                    {country.totalNumbers}
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
                                            color: theme.palette.text.secondary,
                                            fontWeight: 500
                                        }}
                                    >
                                        {allCustomers.length === 0 ?
                                            "Loading customer data..." :
                                            "No customers match the current filters"
                                        }
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Card>
    );
};

export default CustomerTable;