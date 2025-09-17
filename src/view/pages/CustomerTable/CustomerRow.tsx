import React, { useState } from 'react';
import {
    TableRow,
    TableCell,
    Collapse,
    IconButton,
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableHead,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Customer } from './types';
import { ProductTypeCell } from './ProductTypeCell';
import { TechAccountStatusChip } from './TechAccountStatusChip';
import { AccountDetailsTable } from './AccountDetailsTable';

interface Props {
    customer: Customer;
    onToggle: () => void;
    open: boolean;
    onAccountToggle: (techAccountId: number) => void;
    expandedAccounts: Record<number, boolean>;
    fetchAccountDetails: (customerName: string, techAccountId: number, pageNum: number) => void;
    accountDetails: Record<number, any>;
    loadingAccount: Record<number, boolean>;
    accountDetailsHasMore: Record<number, boolean>;
    getScrollRef: (techAccountId: number) => React.RefObject<HTMLDivElement | null>;
}

export const CustomerRow: React.FC<Props> = ({
                                                 customer,
                                                 onToggle,
                                                 open,
                                                 onAccountToggle,
                                                 expandedAccounts,
                                                 fetchAccountDetails,
                                                 accountDetails,
                                                 loadingAccount,
                                                 accountDetailsHasMore,
                                                 getScrollRef,
                                             }) => {
    const [localSearchQuery, setLocalSearchQuery] = useState<Record<number, string>>({});
    const [accountPages, setAccountPages] = useState<Record<number, number>>({});

    const handleSearchChange = (techAccountId: number, query: string) => {
        setLocalSearchQuery(prev => ({ ...prev, [techAccountId]: query }));
    };

    return (
        <>
            <TableRow hover>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={onToggle}>
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
                <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
                            <Typography variant="h6" gutterBottom>Accounts</Typography>
                            <Paper elevation={2} sx={{ mb: 3 }}>
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
                                                                onAccountToggle(acc.techAccountId);
                                                            }
                                                        }}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <TableCell>{acc.techAccountId}</TableCell>
                                                        <TableCell>{acc.techAccountName}</TableCell>
                                                        <TableCell><TechAccountStatusChip status={acc.techAccountStatus} /></TableCell>
                                                        <TableCell>{new Intl.NumberFormat().format(acc.totalNumbers)}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
                                                            <AccountDetailsTable
                                                                techAccountId={acc.techAccountId}
                                                                customerName={customer.customerName}
                                                                initialDetails={accountDetails[acc.techAccountId]}
                                                                expanded={expandedAccounts[acc.techAccountId]}
                                                                onToggle={() => onAccountToggle(acc.techAccountId)}
                                                                loading={loadingAccount[acc.techAccountId]}
                                                                hasMore={accountDetailsHasMore[acc.techAccountId]}
                                                                searchQuery={localSearchQuery[acc.techAccountId] || ''}
                                                                onSearchChange={q => handleSearchChange(acc.techAccountId, q)}
                                                                onLoadMore={() => {
                                                                    const nextPage = (accountPages[acc.techAccountId] || 0) + 1;
                                                                    setAccountPages(prev => ({ ...prev, [acc.techAccountId]: nextPage }));
                                                                    fetchAccountDetails(customer.customerName, acc.techAccountId, nextPage);
                                                                }}
                                                                scrollRef={getScrollRef(acc.techAccountId)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">No accounts found</TableCell>
                                            </TableRow>
                                        )}
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
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">No countries found</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};