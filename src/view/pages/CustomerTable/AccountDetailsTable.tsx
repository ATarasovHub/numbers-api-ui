import React, { useEffect, useState, useCallback } from 'react';
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
} from '@mui/material';
import { TechAccountDetails } from './types';

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
                                                     }) => {
    const [details, setDetails] = useState<TechAccountDetails[]>(initialDetails || []);
    const [filteredDetails, setFilteredDetails] = useState<TechAccountDetails[]>(initialDetails || []);

    useEffect(() => {
        setDetails(initialDetails || []);
    }, [initialDetails]);

    useEffect(() => {
        setFilteredDetails(
            details.filter(detail =>
                detail.number.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [details, searchQuery]);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current || loading || !hasMore) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            onLoadMore();
        }
    }, [loading, hasMore, onLoadMore, scrollRef]);

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll, scrollRef]);

    return (
        <Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box margin={1}>
                    <TextField
                        label="Search Number"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={e => onSearchChange(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}

                    {!loading && details.length > 0 && (
                        <Box
                            ref={scrollRef}
                            sx={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                border: '1px solid #eee',
                                borderRadius: 1.5,
                            }}
                        >
                            <Paper elevation={1}>
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
                                                <TableCell colSpan={6} align="center">
                                                    No numbers match the search query
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Box>
                    )}

                    {!loading && !details.length && (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                            Failed to load account details.
                        </Typography>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};