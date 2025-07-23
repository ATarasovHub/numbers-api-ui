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
    Chip,
    Divider,
    Paper,
    alpha
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
        <Card elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: '100vw' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                    Customer Overview
                </Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: theme => alpha(theme.palette.grey[100], 0.5) }}>
                <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
                    <Typography variant="subtitle2" sx={{ minWidth: '100px' }}>Filter by:</Typography>
                    <TextField
                        label="Customer Name"
                        value={filters.customerName}
                        onChange={e => handleFilterChange('customerName', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 200 }}
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
                            sx={{ minWidth: 150 }}
                            type="number"
                        />
                    </Box>
                </Box>
            </Paper>
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }} aria-label="customers table">
                    <TableHead sx={{ backgroundColor: 'primary.light' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }} />
                            <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Customer Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Product Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Total Numbers</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Accounts</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Countries</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedCustomers.length > 0 ? (
                            displayedCustomers.map((customer, index) => (
                                <React.Fragment key={customer.customerId}>
                                    <TableRow
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? 'grey.50' : 'common.white',
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => handleRowToggle(customer.customerId)}
                                                sx={{ color: 'primary.main' }}
                                            >
                                                {openRows[customer.customerId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </TableCell>
                                        <>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">{customer.customerName}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={customer.productType} size="small" color="primary" variant="outlined" />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{customer.totalNumbers}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{customer.proAccounts.length}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{customer.proCountry.length}</Typography>
                                            </TableCell>
                                        </>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={openRows[customer.customerId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 2 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'text.secondary' }}>
                                                        Details for {customer.customerName}
                                                    </Typography>
                                                    <Divider sx={{ mb: 2 }} />
                                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                        Accounts
                                                    </Typography>
                                                    <Paper elevation={1} sx={{ mb: 3, borderRadius: 1 }}>
                                                        <Table size="small">
                                                            <TableHead sx={{ backgroundColor: 'grey.200' }}>
                                                                <TableRow>
                                                                    <TableCell><Typography variant="subtitle2">ID</Typography></TableCell>
                                                                    <TableCell><Typography variant="subtitle2">Name</Typography></TableCell>
                                                                    <TableCell><Typography variant="subtitle2">Total Accounts</Typography></TableCell>
                                                                    <TableCell><Typography variant="subtitle2">Total Numbers</Typography></TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {customer.proAccounts.length > 0 ? (
                                                                    customer.proAccounts.map(acc => (
                                                                        <TableRow key={acc.techAccountId} hover>
                                                                            <TableCell>{acc.techAccountId}</TableCell>
                                                                            <TableCell>{acc.techAccountName}</TableCell>
                                                                            <TableCell>{acc.totalAccounts}</TableCell>
                                                                            <TableCell>{acc.totalNumbers}</TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                ) : (
                                                                    <TableRow>
                                                                        <TableCell colSpan={4} align="center">
                                                                            <Typography variant="body2" color="textSecondary">No accounts found</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </Paper>
                                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                        Countries
                                                    </Typography>
                                                    <Paper elevation={1} sx={{ borderRadius: 1 }}>
                                                        <Table size="small">
                                                            <TableHead sx={{ backgroundColor: 'grey.200' }}>
                                                                <TableRow>
                                                                    <TableCell><Typography variant="subtitle2">ID</Typography></TableCell>
                                                                    <TableCell><Typography variant="subtitle2">Name</Typography></TableCell>
                                                                    <TableCell><Typography variant="subtitle2">Total Accounts</Typography></TableCell>
                                                                    <TableCell><Typography variant="subtitle2">Total Numbers</Typography></TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {customer.proCountry.length > 0 ? (
                                                                    customer.proCountry.map(country => (
                                                                        <TableRow key={country.countryId} hover>
                                                                            <TableCell>{country.countryId}</TableCell>
                                                                            <TableCell>{country.countryName}</TableCell>
                                                                            <TableCell>{country.totalAccounts}</TableCell>
                                                                            <TableCell>{country.totalNumbers}</TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                ) : (
                                                                    <TableRow>
                                                                        <TableCell colSpan={4} align="center">
                                                                            <Typography variant="body2" color="textSecondary">No countries found</Typography>
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
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body1" sx={{ py: 4 }}>
                                        {allCustomers.length === 0 ? "Loading data..." : "No customers found matching the filters."}
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
//Test
export default CustomerTable;