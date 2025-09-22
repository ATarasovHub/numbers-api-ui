import React, { useState } from 'react';
import { TableRow, TableCell, Collapse, IconButton, Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { NumberProvider } from '../../../../../../utils/domain';
import { isDefined } from '../../../../../../utils/util';
import CountryStatsTable from '../../CountryStatsOverview/CountryStatsTable/CountryStatsTable';
import { providerRowStyles } from './ProviderRow.styles';

const ProviderRow: React.FC<{ provider: NumberProvider }> = ({ provider }) => {
    const [open, setOpen] = useState(false);

    function checkStatus(deletedAt: string) {
        if (!isDefined(deletedAt)) return "Active";
        return new Date(deletedAt) > new Date() ? "Active" : "Deleted";
    }

    const status = checkStatus(provider.deletedAt);

    return (
        <React.Fragment>
            <TableRow sx={providerRowStyles.mainRow}>
                <TableCell sx={{ ...providerRowStyles.cell, ...providerRowStyles.expandCell }}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ ...providerRowStyles.cell, ...providerRowStyles.providerNameCell }} component="th" scope="row">
                    {provider.providerName}
                </TableCell>
                <TableCell sx={{ ...providerRowStyles.cell, ...providerRowStyles.totalNumbersCell }}>
                    {new Intl.NumberFormat().format(provider.totalNumbers)}
                </TableCell>
                <TableCell sx={{ ...providerRowStyles.cell, ...providerRowStyles.assignedNumbersCell }}>
                    {new Intl.NumberFormat().format(provider.totalAssignedNumbers)}
                </TableCell>
                <TableCell sx={{ ...providerRowStyles.cell, ...providerRowStyles.notAssignedCell }}>
                    {new Intl.NumberFormat().format(provider.totalNumbers - provider.totalAssignedNumbers)}
                </TableCell>
                <TableCell sx={{ ...providerRowStyles.cell, ...providerRowStyles.monthlyCostCell }}>
                    {new Intl.NumberFormat().format(provider.totalMonthlyCost)}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={providerRowStyles.collapseCell} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={providerRowStyles.collapseContent}>
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