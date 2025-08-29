import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, CircularProgress, alpha } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PhoneNumberData } from './types';
import { calmTheme } from './theme';

const PhoneNumbersTable: React.FC<{
    countryId: string;
    phoneNumbers: PhoneNumberData[];
    loading: boolean;
}> = ({ countryId, phoneNumbers, loading }) => {
    const [displayedPhoneNumbersCount, setDisplayedPhoneNumbersCount] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const ITEMS_PER_LOAD = 20;

    useEffect(() => {
        setDisplayedPhoneNumbersCount(Math.min(ITEMS_PER_LOAD, phoneNumbers.length));
    }, [phoneNumbers]);

    const loadMorePhoneNumbers = () => {
        setDisplayedPhoneNumbersCount(prev => Math.min(prev + ITEMS_PER_LOAD, phoneNumbers.length));
    };

    const filteredNumbers = searchQuery.trim() === ''
        ? phoneNumbers
        : phoneNumbers.filter(phone =>
            phone.number.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const displayedNumbers = filteredNumbers.slice(0, displayedPhoneNumbersCount);
    const hasMore = displayedPhoneNumbersCount < filteredNumbers.length;

    if (loading) {
        return (
            <Paper elevation={1} sx={{ m: 2, borderRadius: 2, border: `1px solid ${alpha(calmTheme.palette.divider, 0.3)}` }}>
                <Box display="flex" justifyContent="center" my={2}><CircularProgress size={24} /></Box>
            </Paper>
        );
    }

    return (
        <Paper elevation={1} sx={{ m: 2, borderRadius: 2, overflow: 'hidden', border: `1px solid ${alpha(calmTheme.palette.divider, 0.3)}`, display: 'flex', flexDirection: 'column', minHeight: '200px', maxHeight: '400px' }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(calmTheme.palette.divider, 0.3)}` }}>
                <TextField
                    label="Search by Number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                />
            </Box>
            <Box sx={{ flexGrow: 0, flexShrink: 0 }}>
                <Table size="small" sx={{ tableLayout: 'fixed' }}>
                    <TableHead sx={{ backgroundColor: alpha(calmTheme.palette.secondary.main, 0.1) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '15%' }}>Number</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '20%' }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '20%' }}>Tech Account</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '10%' }}>End Date</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '15%' }}>Comment</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '10%' }}>Monthly Cost</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '10%' }}>Assigned Date</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </Box>
            <Box id={`scrollable-phone-numbers-${countryId}`} sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 'calc(100% - 40px)' }}>
                <InfiniteScroll
                    dataLength={displayedNumbers.length}
                    next={loadMorePhoneNumbers}
                    hasMore={hasMore}
                    loader={<Box display="flex" justifyContent="center" my={1}><CircularProgress size={20} /></Box>}
                    scrollableTarget={`scrollable-phone-numbers-${countryId}`}
                    style={{ overflow: 'hidden' }}
                >
                    <Table size="small" sx={{ tableLayout: 'fixed' }}>
                        <TableBody>
                            {displayedNumbers.map((phone: PhoneNumberData, idx: number) => (
                                <TableRow key={idx} hover>
                                    <TableCell sx={{ fontSize: '0.8rem', width: '15%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{phone.number}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', width: '20%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{phone.customer}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', width: '20%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{phone.techAccount}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', width: '10%' }}>{phone.endDate ? new Date(phone.endDate).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', width: '15%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{phone.commentare}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', width: '10%' }}>{phone.monthlyCost?.toFixed(2) ?? '-'}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', width: '10%' }}>{phone.assignedDate ? new Date(phone.assignedDate).toLocaleDateString() : '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </InfiniteScroll>
            </Box>
        </Paper>
    );
};

export default PhoneNumbersTable;
