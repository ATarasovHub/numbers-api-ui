import React from 'react';
import {
    TableRow,
    TableCell,
    Typography,
    Collapse,
    Box,
    IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CountryStats } from '../../../../../../../utils/domain';
import PhoneNumbersTable from '../../PhoneNumbersTableOverview/PhoneNumbersTable/PhoneNumbersTable';
import { countryStatsRowStyles } from './CountryStatsRow.styles';

interface CountryStatsRowProps {
    stat: CountryStats;
    isExpanded: boolean;
    onToggle: () => void;
    phoneNumbers: any[];
    loading: boolean;
}

const CountryStatsRow: React.FC<CountryStatsRowProps> = ({
                                                             stat,
                                                             isExpanded,
                                                             onToggle,
                                                             phoneNumbers,
                                                             loading
                                                         }) => (
    <>
        <TableRow sx={countryStatsRowStyles.row}>
            <TableCell sx={countryStatsRowStyles.expandCell}>
                <IconButton aria-label="expand row" size="small" onClick={onToggle}>
                    {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell sx={countryStatsRowStyles.countryIdCell}>
                <Typography variant="body2" sx={countryStatsRowStyles.cell}>{stat.countryId}</Typography>
            </TableCell>
            <TableCell sx={countryStatsRowStyles.countryNameCell}>
                <Typography variant="body2" sx={countryStatsRowStyles.cell}>{stat.countryName}</Typography>
            </TableCell>
            <TableCell sx={countryStatsRowStyles.totalNumbersCell}>
                <Typography variant="body2" sx={countryStatsRowStyles.cell}>{new Intl.NumberFormat().format(stat.totalNumbers)}</Typography>
            </TableCell>
            <TableCell sx={countryStatsRowStyles.assignedNumbersCell}>
                <Typography variant="body2" sx={countryStatsRowStyles.cell}>{new Intl.NumberFormat().format(stat.assignedNumbers)}</Typography>
            </TableCell>
            <TableCell sx={countryStatsRowStyles.notAssignedCell}>
                <Typography variant="body2" sx={countryStatsRowStyles.cell}>{new Intl.NumberFormat().format(stat.totalNumbers - stat.assignedNumbers)}</Typography>
            </TableCell>
            <TableCell sx={countryStatsRowStyles.monthlyCostCell}>
                <Typography variant="body2" sx={countryStatsRowStyles.cell}>{new Intl.NumberFormat().format(stat.totalMonthlyCost)}</Typography>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell sx={countryStatsRowStyles.collapseCell} colSpan={7}>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={countryStatsRowStyles.collapseContent}>
                        <Typography variant="h6" gutterBottom>Statistics for {stat.countryName}</Typography>
                        <PhoneNumbersTable
                            countryId={stat.countryId.toString()}
                            phoneNumbers={phoneNumbers}
                            loading={loading}
                        />
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
);

export default CountryStatsRow;