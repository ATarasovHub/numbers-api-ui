import React from 'react';
import {
    Box, Paper, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, Card, Typography,
} from '@mui/material';
import CustomerFilter from '../CustomerFilter/CustomerFilter';
import { CustomerRow } from '../CustomerRow/CustomerRow';
import { calmTheme } from '../../../theme/customerTheme';
import { ThemeProvider } from '@mui/material/styles';
import { useCustomers } from '../../../hooks/useCustomers';
import { useCustomerTable } from './useCustomerTable';
import { customerTableStyles } from './CustomerTable.styles';

export const CustomerTable: React.FC = () => {
    const {
        displayedCustomers, filters, loading, hasMore, handleFilterChange, loadMore,
    } = useCustomers();

    const {
        openRows,
        expandedAccounts,
        accountDetails,
        loadingAccount,
        accountDetailsHasMore,
        tableContainerRef,
        handleScroll,
        fetchAccountDetails,
        handleRowToggle,
        handleAccountToggle,
        getOrCreateScrollRef,
    } = useCustomerTable({
        loading,
        hasMore,
        loadMore,
    });

    return (
        <ThemeProvider theme={calmTheme}>
            <Card sx={customerTableStyles.card}>
                <Box sx={customerTableStyles.titleContainer}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={customerTableStyles.title}
                        color="primary"
                    >
                        Customer Overview
                    </Typography>
                </Box>

                <Paper elevation={3} sx={customerTableStyles.filterPaper}>
                    <CustomerFilter
                        filters={filters}
                        onFilterChange={(field, value) => handleFilterChange(field as any, value)}
                    />
                </Paper>

                <Paper elevation={4} sx={customerTableStyles.tablePaper}>
                    <Box
                        ref={tableContainerRef}
                        onScroll={handleScroll}
                        sx={customerTableStyles.tableContainer}
                    >
                        <Table sx={{ minWidth: 750 }} aria-label="customers table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={customerTableStyles.tableHeaderCell} />
                                    <TableCell sx={customerTableStyles.tableHeaderCell}>Customer Name</TableCell>
                                    <TableCell sx={customerTableStyles.tableHeaderCell}>Product Type</TableCell>
                                    <TableCell sx={customerTableStyles.tableHeaderCell}>Total Numbers</TableCell>
                                    <TableCell sx={customerTableStyles.tableHeaderCell}>Accounts</TableCell>
                                    <TableCell sx={customerTableStyles.tableHeaderCell}>Countries</TableCell>
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
                                {loading && displayedCustomers.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            align="center"
                                            sx={customerTableStyles.loadingCell}
                                        >
                                            <CircularProgress size={24} />
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!loading && (displayedCustomers.length === 0 && !hasMore) && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                            <Box sx={customerTableStyles.noDataContainer}>
                                                <Typography
                                                    variant="h6"
                                                    color="text.secondary"
                                                    fontWeight={500}
                                                >
                                                    🔍 No customers found
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={customerTableStyles.noDataText}
                                                >
                                                    Try adjusting your search criteria or check if the customer name is spelled correctly.
                                                </Typography>
                                            </Box>
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