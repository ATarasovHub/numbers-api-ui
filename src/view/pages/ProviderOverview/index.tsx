import React from 'react';
import {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    Card,
    Table,
    Paper,
    alpha,
    ThemeProvider
} from "@mui/material";
import { useProviders } from './useProviders';
import ProviderRow from './ProviderRow';
import { calmTheme } from './theme';

export const ProviderOverview: React.FC = () => {
    const {
        providers,
        filters,
        loading,
        handleFilterChange,
    } = useProviders();

    return (
        <ThemeProvider theme={calmTheme}>
            <Card
                elevation={6}
                sx={{
                    p: {xs: 2, sm: 3},
                    borderRadius: 3,
                    maxWidth: '100vw',
                }}
            >
                <Box mb={3} pb={2} borderBottom={`2px solid ${alpha(calmTheme.palette.primary.main, 0.2)}`}>
                    <Typography variant="h4" component="h1" fontWeight="800" color="primary">
                        Provider Overview
                    </Typography>
                </Box>
                <Paper
                    elevation={3}
                    sx={{ p: 2.5, mb: 3, borderRadius: 2.5 }}
                >
                    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
                        <Typography variant="subtitle2" sx={{minWidth: '100px', fontWeight: 600}}>Filter by:</Typography>
                        <TextField
                            label="Provider Name"
                            value={filters.providerName}
                            onChange={e => handleFilterChange('providerName', e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 220 }}
                        />
                        <Box display="flex" alignItems="center" gap={1}>
                            <Select
                                value={filters.totalNumbersOp}
                                onChange={e => handleFilterChange('totalNumbersOp', e.target.value as string)}
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 70 }}
                            >
                                <MenuItem value=">=">&ge;</MenuItem>
                                <MenuItem value="<=">&le;</MenuItem>
                            </Select>
                            <TextField
                                label="Total Numbers"
                                value={filters.totalNumbers}
                                onChange={e => handleFilterChange('totalNumbers', e.target.value)}
                                variant="outlined"
                                size="small"
                                type="number"
                                sx={{ minWidth: 150 }}
                            />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Select
                                value={filters.totalAssignedNumbersOp}
                                onChange={e => handleFilterChange('totalAssignedNumbersOp', e.target.value as string)}
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 70 }}
                            >
                                <MenuItem value=">=">&ge;</MenuItem>
                                <MenuItem value="<=">&le;</MenuItem>
                            </Select>
                            <TextField
                                label="Assigned Numbers"
                                value={filters.totalAssignedNumbers}
                                onChange={e => handleFilterChange('totalAssignedNumbers', e.target.value)}
                                variant="outlined"
                                size="small"
                                type="number"
                                sx={{ minWidth: 150 }}
                            />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Select
                                value={filters.totalMonthlyCostOp}
                                onChange={e => handleFilterChange('totalMonthlyCostOp', e.target.value as string)}
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 70 }}
                            >
                                <MenuItem value=">=">&ge;</MenuItem>
                                <MenuItem value="<=">&le;</MenuItem>
                            </Select>
                            <TextField
                                label="Monthly Cost"
                                value={filters.totalMonthlyCost}
                                onChange={e => handleFilterChange('totalMonthlyCost', e.target.value)}
                                variant="outlined"
                                size="small"
                                type="number"
                                sx={{ minWidth: 150 }}
                            />
                        </Box>
                    </Box>
                </Paper>
                <Paper elevation={4} sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
                    <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <Table sx={{ minWidth: 750 }} aria-label="providers table">
                            <TableHead>
                                <TableRow>
                                    {['', 'Provider Name', 'Total Numbers', 'Assigned Numbers', 'Not Assigned Numbers', 'Total Monthly Cost']
                                        .map((title, idx) => (
                                            <TableCell key={idx} sx={{ fontWeight: '700' }}>
                                                {title}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><Typography>Loading...</Typography></TableCell></TableRow>
                                ) : providers.length > 0 ? (
                                    providers.map(provider => (
                                        <ProviderRow key={provider.providerId} provider={provider} />
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><Typography>No providers match filters</Typography></TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                </Paper>
            </Card>
        </ThemeProvider>
    );
}

export default ProviderOverview;