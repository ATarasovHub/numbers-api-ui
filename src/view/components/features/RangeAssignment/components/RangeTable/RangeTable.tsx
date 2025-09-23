import React from 'react';
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    CircularProgress,
} from '@mui/material';
import { NumberOverview } from '../../../../../types/rangeAssignmentTypes';
import { styles } from './RangeTable.styles';
import { formatDate } from '../../../../../../utils/formatDate';

interface RangeTableProps {
    tableData: NumberOverview[];
    loading: boolean;
    isInitialSearch: boolean;
    hasMore: boolean;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

const RangeTable: React.FC<RangeTableProps> = ({
                                                   tableData,
                                                   loading,
                                                   isInitialSearch,
                                                   hasMore,
                                                   onScroll,
                                               }) => {
    return (
        <Box sx={styles.container}>
            <Typography sx={styles.title}>Range Table</Typography>
            {loading && isInitialSearch ? (
                <Box sx={styles.loadingContainer}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={styles.scrollContainer} onScroll={onScroll}>
                    <Table size="small" sx={{ width: '100%' }}>
                        <TableHead sx={styles.tableHeader}>
                            <TableRow>
                                <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>Number</TableCell>
                                <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>Start Date</TableCell>
                                <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>End Date</TableCell>
                                <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>Customer Name</TableCell>
                                <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>Tech Account</TableCell>
                                <TableCell sx={{...styles.tableHeaderCell, width: '8%'}}>Account Status</TableCell>
                                <TableCell sx={{...styles.tableHeaderCell, width: '12%'}}>Service Detail</TableCell>
                                <TableCell sx={{...styles.tableHeaderCell, width: '10%'}}>Comment</TableCell>
                                <TableCell sx={{...styles.tableHeaderCell, width: '10%'}}>Assignment Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row) => (
                                <TableRow key={row.numberId} sx={styles.tableRow}>
                                    <TableCell>{row.number}</TableCell>
                                    <TableCell>{formatDate(row.startDate)}</TableCell>
                                    <TableCell>{formatDate(row.endDate)}</TableCell>
                                    <TableCell>{row.customerName}</TableCell>
                                    <TableCell>{row.techAccountName}</TableCell>
                                    <TableCell>{row.techAccountStatus}</TableCell>
                                    <TableCell>{row.serviceDetail}</TableCell>
                                    <TableCell>{row.comment || ''}</TableCell>
                                    <TableCell>{row.assignmentStatus || ''}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {loading && !isInitialSearch && (
                        <Box sx={styles.loadMoreContainer}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                    {!hasMore && tableData.length > 0 && (
                        <Box sx={styles.noMoreData}>
                            <Typography>No more data to load</Typography>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default RangeTable;