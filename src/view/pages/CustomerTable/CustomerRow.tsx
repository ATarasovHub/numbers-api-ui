import React, { useState } from 'react';
import { TableRow, TableCell, Collapse, IconButton, Box, Typography, Paper, Table, TableHead, TableBody, TextField } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Customer, TechAccountDetails } from './types';
import ProductTypeCell from './ProductTypeCell';
import TechAccountStatusChip from './TechAccountStatusChip';

interface CustomerRowProps {
    customer: Customer;
}

const AccountDetailsTable: React.FC<{ details: TechAccountDetails[], searchQuery: string }> = ({ details, searchQuery }) => {
    const filteredDetails = details.filter(detail =>
        detail.number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
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
                    {filteredDetails.length > 0 ? (
                        filteredDetails.map((detail, idx) => (
                            <TableRow key={idx} hover>
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
                            <TableCell colSpan={6} align="center">No numbers match the search query</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
};

const CustomerRow: React.FC<CustomerRowProps> = ({ customer }) => {
    const [open, setOpen] = useState(false);
    const [expandedAccounts, setExpandedAccounts] = useState<{ [key: number]: boolean }>({});
    const [accountDetails, setAccountDetails] = useState<{ [key: number]: TechAccountDetails[] }>({});
    const [loadingAccount, setLoadingAccount] = useState<{ [key: number]: boolean }>({});
    const [searchQuery, setSearchQuery] = useState<{ [key: number]: string }>({});

    const handleAccountToggle = (techAccountId: number) => {
        setExpandedAccounts(prev => ({ ...prev, [techAccountId]: !prev[techAccountId] }));
    };

    const fetchAccountDetails = (customerName: string, techAccountId: number) => {
        if (accountDetails[techAccountId]) {
            handleAccountToggle(techAccountId);
            return;
        }
        if (loadingAccount[techAccountId]) return;

        setLoadingAccount(prev => ({ ...prev, [techAccountId]: true }));
        const url = `http://localhost:8080/customer/overview/${encodeURIComponent(customerName)}/${techAccountId}`;
        fetch(url)
            .then(res => res.json())
            .then((data: TechAccountDetails[]) => {
                setAccountDetails(prev => ({ ...prev, [techAccountId]: data }));
                handleAccountToggle(techAccountId);
            })
            .catch(err => console.error("Failed to fetch account details:", err))
            .finally(() => setLoadingAccount(prev => ({ ...prev, [techAccountId]: false })));
    };

    return (
        <React.Fragment>
            <TableRow hover>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{customer.customerName}</TableCell>
                <TableCell><ProductTypeCell productType={customer.productType} /></TableCell>
                <TableCell>{new Intl.NumberFormat().format(customer.totalNumbers)}</TableCell>
                <TableCell>{customer.proAccounts.length}</TableCell>
                <TableCell>{customer.proCountries.length}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
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
                                        {customer.proAccounts.map(acc => (
                                            <React.Fragment key={acc.techAccountId}>
                                                <TableRow hover onClick={() => fetchAccountDetails(customer.customerName, acc.techAccountId)} sx={{ cursor: 'pointer' }}>
                                                    <TableCell>{acc.techAccountId}</TableCell>
                                                    <TableCell>{acc.techAccountName}</TableCell>
                                                    <TableCell><TechAccountStatusChip status={acc.techAccountStatus} /></TableCell>
                                                    <TableCell>{new Intl.NumberFormat().format(acc.totalNumbers)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                                        <Collapse in={expandedAccounts[acc.techAccountId]} timeout="auto" unmountOnExit>
                                                            <Box margin={1}>
                                                                <TextField
                                                                    label="Search Number"
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={searchQuery[acc.techAccountId] || ''}
                                                                    onChange={(e) => setSearchQuery(prev => ({ ...prev, [acc.techAccountId]: e.target.value }))}
                                                                    fullWidth
                                                                    sx={{mb: 2}}
                                                                />
                                                                {loadingAccount[acc.techAccountId] && <Typography>Loading...</Typography>}
                                                                {accountDetails[acc.techAccountId] &&
                                                                    <AccountDetailsTable details={accountDetails[acc.techAccountId]} searchQuery={searchQuery[acc.techAccountId] || ''} />
                                                                }
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
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
                                        {customer.proCountries.map(country => (
                                            <TableRow key={country.countryId} hover>
                                                <TableCell>{country.countryId}</TableCell>
                                                <TableCell>{country.countryName}</TableCell>
                                                <TableCell>{country.totalAccounts}</TableCell>
                                                <TableCell>{new Intl.NumberFormat().format(country.totalNumbers)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default CustomerRow;
