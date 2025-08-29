import React, { useState } from 'react';
import { Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, Collapse, IconButton, alpha } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CountryStats } from '../../../utils/domain';
import { PhoneNumberData } from './types';
import PhoneNumbersTable from './PhoneNumbersTable';
import { calmTheme } from './theme';

const CountryStatsTable: React.FC<{ stats: CountryStats[] }> = ({ stats }) => {
    const [expandedCountries, setExpandedCountries] = useState<{ [key: string]: boolean }>({});
    const [phoneNumbersData, setPhoneNumbersData] = useState<{ [key: string]: PhoneNumberData[] }>({});
    const [loadingPhoneNumbers, setLoadingPhoneNumbers] = useState<{ [key: string]: boolean }>({});

    const toggleCountryExpansion = async (countryId: string, countryName: string) => {
        const isCurrentlyExpanded = expandedCountries[countryId];
        setExpandedCountries(prev => ({ ...prev, [countryId]: !isCurrentlyExpanded }));

        if (!isCurrentlyExpanded && !phoneNumbersData[countryId]) {
            setLoadingPhoneNumbers(prev => ({ ...prev, [countryId]: true }));
            try {
                const response = await fetch(`http://localhost:8080/numbers/overview/country/${encodeURIComponent(countryName)}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const rawData = await response.json();
                const adaptedData = rawData.map((item: any): PhoneNumberData => ({
                    number: item.number,
                    status: item.status || (!item.customerName && !item.techAccountName ? 'Free' : 'Active'),
                    customer: item.customerName,
                    techAccount: item.techAccountName,
                    endDate: item.endDate,
                    commentare: item.comment,
                    monthlyCost: item.monthlyCost,
                    assignedDate: item.startDate
                }));
                setPhoneNumbersData(prev => ({ ...prev, [countryId]: adaptedData }));
            } catch (error) {
                console.error(`Failed to fetch phone numbers for country ${countryName} (ID: ${countryId}):`, error);
                setPhoneNumbersData(prev => ({ ...prev, [countryId]: [] }));
            } finally {
                setLoadingPhoneNumbers(prev => ({ ...prev, [countryId]: false }));
            }
        }
    };

    return (
        <Paper elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', border: `1px solid ${alpha(calmTheme.palette.divider, 0.5)}` }}>
            <Table size="small">
                <TableHead sx={{ backgroundColor: alpha(calmTheme.palette.primary.main, 0.12) }}>
                    <TableRow>
                        <TableCell sx={{ width: '5%' }}><Typography variant="subtitle2" fontWeight="600"></Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="600">Country ID</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="600">Country Name</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="600">Total Numbers</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="600">Assigned Numbers</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="600">Not Assigned Numbers</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2" fontWeight="600">Monthly Cost</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stats && stats.length > 0 ? (
                        stats.map((stat, idx) => (
                            <React.Fragment key={stat.countryId}>
                                <TableRow sx={{ '&:hover': { backgroundColor: alpha(calmTheme.palette.secondary.light, 0.2) } }}>
                                    <TableCell>
                                        <IconButton aria-label="expand row" size="small" onClick={() => toggleCountryExpansion(stat.countryId.toString(), stat.countryName)}>
                                            {expandedCountries[stat.countryId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell><Typography variant="body2" fontWeight="500">{stat.countryId}</Typography></TableCell>
                                    <TableCell><Typography variant="body2" fontWeight="500">{stat.countryName}</Typography></TableCell>
                                    <TableCell><Typography variant="body2" fontWeight="500">{new Intl.NumberFormat().format(stat.totalNumbers)}</Typography></TableCell>
                                    <TableCell><Typography variant="body2" fontWeight="500">{new Intl.NumberFormat().format(stat.assignedNumbers)}</Typography></TableCell>
                                    <TableCell><Typography variant="body2" fontWeight="500">{new Intl.NumberFormat().format(stat.totalNumbers - stat.assignedNumbers)}</Typography></TableCell>
                                    <TableCell><Typography variant="body2" fontWeight="500">{new Intl.NumberFormat().format(stat.totalMonthlyCost)}</Typography></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                        <Collapse in={expandedCountries[stat.countryId]} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 2 }}>
                                                <Typography variant="h6" gutterBottom>Statistics for {stat.countryName}</Typography>
                                                <PhoneNumbersTable
                                                    countryId={stat.countryId.toString()}
                                                    phoneNumbers={phoneNumbersData[stat.countryId] || []}
                                                    loading={loadingPhoneNumbers[stat.countryId] || false}
                                                />
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}><Typography>No country statistics</Typography></TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default CountryStatsTable;
