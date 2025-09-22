import React from 'react';
import {
    TableRow,
    TableCell,
    Collapse,
    IconButton,
    Box,
    Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Customer } from '../../../types/customerOverviewTypes';
import { ProductTypeCell } from '../ProductTypeCell/ProductTypeCell';
import { customerRowStyles } from './CustomerRow.styles';
import { useCustomerRow } from './useCustomerRow';
import { CustomerAccountsTable } from './CustomerAccountsTable/CustomerAccountsTable';
import { CustomerCountriesTable } from './CustomerCountriesTable/CustomerCountriesTable';

interface Props {
    customer: Customer;
    onToggle: () => void;
    open: boolean;
    onAccountToggle: (techAccountId: number) => void;
    expandedAccounts: Record<number, boolean>;
    fetchAccountDetails: (customerName: string, techAccountId: number, pageNum: number, searchNumber?: string) => void;
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
    const {
        localSearchQuery,
        handleSearchChange,
        handleSearchSubmit,
        handleSearchReset,
        handleLoadMore,
    } = useCustomerRow({
        customerName: customer.customerName,
        fetchAccountDetails,
    });

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
                        <Box sx={customerRowStyles.collapseContainer}>
                            <Typography variant="h6" gutterBottom sx={customerRowStyles.sectionTitle}>
                                Accounts
                            </Typography>

                            <CustomerAccountsTable
                                accounts={customer.proAccounts}
                                customerName={customer.customerName}
                                expandedAccounts={expandedAccounts}
                                accountDetails={accountDetails}
                                loadingAccount={loadingAccount}
                                accountDetailsHasMore={accountDetailsHasMore}
                                localSearchQuery={localSearchQuery}
                                onAccountToggle={onAccountToggle}
                                fetchAccountDetails={fetchAccountDetails}
                                handleSearchChange={handleSearchChange}
                                handleSearchSubmit={handleSearchSubmit}
                                handleSearchReset={handleSearchReset}
                                handleLoadMore={handleLoadMore}
                                getScrollRef={getScrollRef}
                            />

                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ ...customerRowStyles.sectionTitle, mt: 3 }}
                            >
                                Countries
                            </Typography>

                            <CustomerCountriesTable countries={customer.proCountries} />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};