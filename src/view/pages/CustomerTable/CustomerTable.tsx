import React, { useState, useRef } from 'react';
import {
    Box, Paper, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, Card, Typography, alpha,
} from '@mui/material';
import CustomerFilter from './CustomerFilter';
import { CustomerRow } from './CustomerRow';
import { calmTheme } from './theme';
import { ThemeProvider } from '@mui/material/styles';
import { useCustomers } from './useCustomers';

export const CustomerTable: React.FC = () => {
    const {
        displayedCustomers, filters, loading, hasMore, handleFilterChange, loadMore,
    } = useCustomers();

    const [openRows, setOpenRows] = useState<Record<number, boolean>>({});
    const [expandedAccounts, setExpandedAccounts] = useState<Record<number, boolean>>({});
    const [accountDetails, setAccountDetails] = useState<Record<number, any>>({});
    const [loadingAccount, setLoadingAccount] = useState<Record<number, boolean>>({});
    const [accountDetailsHasMore, setAccountDetailsHasMore] = useState<Record<number, boolean>>({});
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        const container = tableContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollHeight - scrollTop <= clientHeight * 1.1) {
                if (!loading && hasMore) {
                    loadMore();
                }
            }
        }
    };

    const accountDetailsScrollRefs = useRef<Record<number, React.RefObject<HTMLDivElement | null>>>({});

    const getOrCreateScrollRef = (techAccountId: number): React.RefObject<HTMLDivElement | null> => {
        if (!accountDetailsScrollRefs.current[techAccountId]) {
            accountDetailsScrollRefs.current[techAccountId] = React.createRef<HTMLDivElement>();
        }
        return accountDetailsScrollRefs.current[techAccountId];
    };

    const fetchAccountDetails = (customerName: string, techAccountId: number, pageNum: number) => {
        if (loadingAccount[techAccountId]) return;

        setLoadingAccount(prev => ({ ...prev, [techAccountId]: true }));

        fetch(`http://localhost:8080/customer/overview/${encodeURIComponent(customerName)}/${techAccountId}?page=${pageNum}&size=10`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(response => {
                const isLastPage = response.last;
                const newContent = response.content;
                setAccountDetails(prev => ({
                    ...prev,
                    [techAccountId]: pageNum === 0 ? newContent : [...(prev[techAccountId] || []), ...newContent],
                }));
                setAccountDetailsHasMore(prev => ({ ...prev, [techAccountId]: !isLastPage }));
                setExpandedAccounts(prev => ({ ...prev, [techAccountId]: true }));
            })
            .catch(err => {
                console.error(`Error loading account details: ${err}`);
                setExpandedAccounts(prev => ({ ...prev, [techAccountId]: false }));
            })
            .finally(() => {
                setLoadingAccount(prev => ({ ...prev, [techAccountId]: false }));
            });
    };

    const handleRowToggle = (customerId: number) => {
        setOpenRows(prev => ({ ...prev, [customerId]: !prev[customerId] }));
    };

    const handleAccountToggle = (techAccountId: number) => {
        setExpandedAccounts(prev => ({ ...prev, [techAccountId]: !prev[techAccountId] }));
    };

    return (
        <ThemeProvider theme={calmTheme}>
            <Card
                elevation={6}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    maxWidth: '100vw',
                }}
            >
                <Box mb={3} pb={2} borderBottom={`2px solid ${alpha(calmTheme.palette.primary.main, 0.2)}`}>
                    <Typography variant="h4" component="h1" fontWeight="800" color="primary">
                        Customer Overview
                    </Typography>
                </Box>
                <Paper
                    elevation={3}
                    sx={{ p: 2.5, mb: 3, borderRadius: 2.5 }}
                >
                    <CustomerFilter filters={filters} onFilterChange={(field, value) => handleFilterChange(field as any, value)} />
                </Paper>
                <Paper elevation={4} sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
                    <Box
                        ref={tableContainerRef}
                        onScroll={handleScroll}
                        sx={{ maxHeight: '70vh', overflowY: 'auto' }}
                    >
                        <Table sx={{ minWidth: 750 }} aria-label="customers table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: '700' }} />
                                    <TableCell sx={{ fontWeight: '700' }}>Customer Name</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }}>Product Type</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }}>Total Numbers</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }}>Accounts</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }}>Countries</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedCustomers.map(customer => (
                                    <CustomerRow
                                        key={customer.customerId}
                                        customer={customer}
                                        onToggle={() => handleRowToggle(customer.customerId)}
                                        open={openRows[customer.customerId] || false}
                                        onAccountToggle={handleAccountToggle}
                                        expandedAccounts={expandedAccounts}
                                        fetchAccountDetails={fetchAccountDetails}
                                        accountDetails={accountDetails}
                                        loadingAccount={loadingAccount}
                                        accountDetailsHasMore={accountDetailsHasMore}
                                        getScrollRef={getOrCreateScrollRef}
                                    />
                                ))}
                                {loading && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 2 }}>
                                            <CircularProgress size={24} />
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!loading && displayedCustomers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                            <Typography>No customers found matching your criteria.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                </Paper>
            </Card>
        </ThemeProvider>
    );
};