import React from 'react';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { TechAccountStatusChip } from '../../TechAccountStatusChip/TechAccountStatusChip';
import { AccountDetailsTable } from '../../AccountDetailsTable/AccountDetailsTable';
import { customerAccountsTableStyles } from './CustomerAccountsTable.styles';

interface CustomerAccountsTableProps {
    accounts: any[];
    customerName: string;
    expandedAccounts: Record<number, boolean>;
    accountDetails: Record<number, any>;
    loadingAccount: Record<number, boolean>;
    accountDetailsHasMore: Record<number, boolean>;
    localSearchQuery: Record<number, string>;
    onAccountToggle: (techAccountId: number) => void;
    fetchAccountDetails: (customerName: string, techAccountId: number, pageNum: number, searchNumber?: string) => void;
    handleSearchChange: (techAccountId: number, query: string) => void;
    handleSearchSubmit: (techAccountId: number) => void;
    handleSearchReset: (techAccountId: number) => void;
    handleLoadMore: (techAccountId: number) => void;
    getScrollRef: (techAccountId: number) => React.RefObject<HTMLDivElement | null>;
}

export const CustomerAccountsTable: React.FC<CustomerAccountsTableProps> = ({
                                                                                accounts,
                                                                                customerName,
                                                                                expandedAccounts,
                                                                                accountDetails,
                                                                                loadingAccount,
                                                                                accountDetailsHasMore,
                                                                                localSearchQuery,
                                                                                onAccountToggle,
                                                                                fetchAccountDetails,
                                                                                handleSearchChange,
                                                                                handleSearchSubmit,
                                                                                handleSearchReset,
                                                                                handleLoadMore,
                                                                                getScrollRef,
                                                                            }) => {
    return (
        <Paper elevation={2} sx={customerAccountsTableStyles.paper}>
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
                    {accounts.length > 0 ? (
                        accounts.map(acc => (
                            <React.Fragment key={acc.techAccountId}>
                                <TableRow
                                    hover
                                    onClick={() => {
                                        if (!accountDetails[acc.techAccountId] || !expandedAccounts[acc.techAccountId]) {
                                            fetchAccountDetails(customerName, acc.techAccountId, 0);
                                        } else {
                                            onAccountToggle(acc.techAccountId);
                                        }
                                    }}
                                    sx={customerAccountsTableStyles.tableRow}
                                >
                                    <TableCell>{acc.techAccountId}</TableCell>
                                    <TableCell>{acc.techAccountName}</TableCell>
                                    <TableCell>
                                        <TechAccountStatusChip status={acc.techAccountStatus} />
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat().format(acc.totalNumbers)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}
                                    >
                                        <AccountDetailsTable
                                            techAccountId={acc.techAccountId}
                                            customerName={customerName}
                                            initialDetails={accountDetails[acc.techAccountId]}
                                            expanded={expandedAccounts[acc.techAccountId]}
                                            onToggle={() => onAccountToggle(acc.techAccountId)}
                                            loading={loadingAccount[acc.techAccountId]}
                                            hasMore={accountDetailsHasMore[acc.techAccountId]}
                                            searchQuery={localSearchQuery[acc.techAccountId] || ''}
                                            onSearchChange={q => handleSearchChange(acc.techAccountId, q)}
                                            onSearchSubmit={() => handleSearchSubmit(acc.techAccountId)}
                                            onSearchReset={() => handleSearchReset(acc.techAccountId)}
                                            onLoadMore={() => handleLoadMore(acc.techAccountId)}
                                            scrollRef={getScrollRef(acc.techAccountId)}
                                        />
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                align="center"
                                sx={customerAccountsTableStyles.noDataCell}
                            >
                                No accounts found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
};