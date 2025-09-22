import React from 'react';
import { TableRow, TableCell, TableHead } from '@mui/material';
import { phoneNumbersHeaderStyles } from './PhoneNumbersHeader.styles';
import { phoneNumbersTableStyles } from '../PhoneNumbersTable/PhoneNumbersTable.styles';

const PhoneNumbersHeader: React.FC = () => (
    <TableHead sx={phoneNumbersTableStyles.tableHeader}>
        <TableRow>
            <TableCell sx={{ ...phoneNumbersHeaderStyles.cell, ...phoneNumbersHeaderStyles.numberCell }}>Number</TableCell>
            <TableCell sx={{ ...phoneNumbersHeaderStyles.cell, ...phoneNumbersHeaderStyles.customerCell }}>Customer</TableCell>
            <TableCell sx={{ ...phoneNumbersHeaderStyles.cell, ...phoneNumbersHeaderStyles.techAccountCell }}>Tech Account</TableCell>
            <TableCell sx={{ ...phoneNumbersHeaderStyles.cell, ...phoneNumbersHeaderStyles.endDateCell }}>End Date</TableCell>
            <TableCell sx={{ ...phoneNumbersHeaderStyles.cell, ...phoneNumbersHeaderStyles.commentCell }}>Comment</TableCell>
            <TableCell sx={{ ...phoneNumbersHeaderStyles.cell, ...phoneNumbersHeaderStyles.monthlyCostCell }}>Monthly Cost</TableCell>
            <TableCell sx={{ ...phoneNumbersHeaderStyles.cell, ...phoneNumbersHeaderStyles.assignedDateCell }}>Assigned Date</TableCell>
        </TableRow>
    </TableHead>
);

export default PhoneNumbersHeader;