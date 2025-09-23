import React from 'react';
import { TableCell, TableRow, Typography } from '@mui/material';
import { countryStatsHeaderStyles } from './CountryStatsHeader.styles';

const CountryStatsHeader: React.FC = () => (
    <TableRow sx={countryStatsHeaderStyles.row}>
        <TableCell sx={countryStatsHeaderStyles.expandCell} />
        <TableCell sx={countryStatsHeaderStyles.countryIdCell}>
            <Typography variant="subtitle2" sx={countryStatsHeaderStyles.cell}>Country ID</Typography>
        </TableCell>
        <TableCell sx={countryStatsHeaderStyles.countryNameCell}>
            <Typography variant="subtitle2" sx={countryStatsHeaderStyles.cell}>Country Name</Typography>
        </TableCell>
        <TableCell sx={countryStatsHeaderStyles.totalNumbersCell}>
            <Typography variant="subtitle2" sx={countryStatsHeaderStyles.cell}>Total Numbers</Typography>
        </TableCell>
        <TableCell sx={countryStatsHeaderStyles.assignedNumbersCell}>
            <Typography variant="subtitle2" sx={countryStatsHeaderStyles.cell}>Assigned Numbers</Typography>
        </TableCell>
        <TableCell sx={countryStatsHeaderStyles.notAssignedCell}>
            <Typography variant="subtitle2" sx={countryStatsHeaderStyles.cell}>Not Assigned Numbers</Typography>
        </TableCell>
        <TableCell sx={countryStatsHeaderStyles.monthlyCostCell}>
            <Typography variant="subtitle2" sx={countryStatsHeaderStyles.cell}>Monthly Cost</Typography>
        </TableCell>
    </TableRow>
);

export default CountryStatsHeader;