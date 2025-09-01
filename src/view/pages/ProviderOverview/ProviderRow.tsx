import React, { useState } from 'react';
import { TableRow, TableCell, Collapse, IconButton, Box, Typography, alpha } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { NumberProvider } from '../../../utils/domain';
import { isDefined } from '../../../utils/util';
import CountryStatsTable from './CountryStatsTable';
import { calmTheme } from './theme';

const ProviderRow: React.FC<{ provider: NumberProvider }> = ({ provider }) => {
    const [open, setOpen] = useState(false);

    function checkStatus(deletedAt: string) {
        if (!isDefined(deletedAt)) return "Active";
        return new Date(deletedAt) > new Date() ? "Active" : "Deleted";
    }

    const status = checkStatus(provider.deletedAt);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell sx={{ width: '5%' }}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ width: '30%' }} component="th" scope="row">{provider.providerName}</TableCell>
                <TableCell sx={{ width: '15%' }}>{new Intl.NumberFormat().format(provider.totalNumbers)}</TableCell>
                <TableCell sx={{ width: '15%' }}>{new Intl.NumberFormat().format(provider.totalAssignedNumbers)}</TableCell>
                <TableCell sx={{ width: '15%' }}>{new Intl.NumberFormat().format(provider.totalNumbers - provider.totalAssignedNumbers)}</TableCell>
                <TableCell sx={{ width: '20%' }}>{new Intl.NumberFormat().format(provider.totalMonthlyCost)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 1, width: '100%' }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Country Statistics for {provider.providerName}
                            </Typography>
                            <CountryStatsTable stats={provider.countryStats || []} />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default ProviderRow;
