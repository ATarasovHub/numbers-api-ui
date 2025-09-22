import React from 'react';
import {
    Box,
    TextField,
    CircularProgress,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Collapse,
    Button,
    IconButton,
    InputAdornment,
} from '@mui/material';
import {TechAccountDetails} from "../../../../types/customerOverviewTypes";
import ClearIcon from '@mui/icons-material/Clear';
import {accountDetailsTableStyles} from './AccountDetailsTable.styles';
import {useAccountDetailsTable} from './useAccountDetailsTable';

interface Props {
    techAccountId: number;
    customerName: string;
    expanded: boolean;
    onToggle: () => void;
    initialDetails?: TechAccountDetails[];
    loading: boolean;
    hasMore: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onLoadMore: () => void;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    onSearchSubmit: () => void;
    onSearchReset: () => void;
}

export const AccountDetailsTable: React.FC<Props> = ({
                                                         techAccountId,
                                                         customerName,
                                                         expanded,
                                                         onToggle,
                                                         initialDetails,
                                                         loading,
                                                         hasMore,
                                                         searchQuery,
                                                         onSearchChange,
                                                         onLoadMore,
                                                         scrollRef,
                                                         onSearchSubmit,
                                                         onSearchReset,
                                                     }) => {
    const {
        details,
        filteredDetails,
        appliedSearchQuery,
        handleLocalSearchSubmit,
        handleResetSearch,
        handleScroll,
    } = useAccountDetailsTable({
        initialDetails,
        searchQuery,
        onSearchSubmit,
        onSearchReset,
        onSearchChange,
        onLoadMore,
        hasMore,
        loading,
        scrollRef,
    });

    return (
        <Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box margin={1}>
                    <Box sx={accountDetailsTableStyles.searchFieldContainer}>
                        <TextField
                            label="Search Number"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={e => onSearchChange(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLocalSearchSubmit()}
                            fullWidth
                            placeholder="Enter number to find..."
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                endAdornment: searchQuery.trim() !== '' && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={handleResetSearch}
                                        >
                                            <ClearIcon fontSize="small"/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: accountDetailsTableStyles.searchField,
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleLocalSearchSubmit}
                            disabled={loading || !searchQuery.trim()}
                            sx={accountDetailsTableStyles.actionButton}
                        >
                            {loading ? <CircularProgress size={18} color="inherit"/> : "FIND"}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleResetSearch}
                            sx={accountDetailsTableStyles.actionButton}
                        >
                            RESET
                        </Button>
                    </Box>

                    {loading && details.length === 0 && (
                        <Box sx={accountDetailsTableStyles.loaderContainer}>
                            <CircularProgress size={24}/>
                        </Box>
                    )}

                    {!loading && details.length > 0 && (
                        <Box
                            ref={scrollRef}
                            onScroll={handleScroll}
                            sx={accountDetailsTableStyles.scrollContainer}
                        >
                            <Paper elevation={1}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={accountDetailsTableStyles.tableHeader}>Start Date</TableCell>
                                            <TableCell sx={accountDetailsTableStyles.tableHeader}>End Date</TableCell>
                                            <TableCell sx={accountDetailsTableStyles.tableHeader}>Number</TableCell>
                                            <TableCell sx={accountDetailsTableStyles.tableHeader}>Comment</TableCell>
                                            <TableCell sx={accountDetailsTableStyles.tableHeader}>Provider</TableCell>
                                            <TableCell sx={accountDetailsTableStyles.tableHeader}>Service
                                                Detail</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredDetails.length > 0 ? (
                                            filteredDetails.map((detail, idx) => (
                                                <TableRow
                                                    key={`${detail.number}-${detail.startDate ?? idx}`}
                                                    hover
                                                >
                                                    <TableCell
                                                        sx={accountDetailsTableStyles.tableCell}>{detail.startDate ?? '-'}</TableCell>
                                                    <TableCell
                                                        sx={accountDetailsTableStyles.tableCell}>{detail.endDate ?? '-'}</TableCell>
                                                    <TableCell
                                                        sx={accountDetailsTableStyles.tableCell}>{detail.number}</TableCell>
                                                    <TableCell
                                                        sx={accountDetailsTableStyles.tableCell}>{detail.comment ?? '-'}</TableCell>
                                                    <TableCell
                                                        sx={accountDetailsTableStyles.tableCell}>{detail.numberProviderName}</TableCell>
                                                    <TableCell
                                                        sx={accountDetailsTableStyles.tableCell}>{detail.serviceDetail}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    {appliedSearchQuery
                                                        ? "No numbers match the search query"
                                                        : "No numbers available"}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Box>
                    )}

                    {!loading && details.length === 0 && !initialDetails && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={accountDetailsTableStyles.emptyMessage}
                        >
                            Click to load account details.
                        </Typography>
                    )}

                    {!loading && details.length === 0 && initialDetails && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={accountDetailsTableStyles.emptyMessage}
                        >
                            No numbers found for this account.
                        </Typography>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};