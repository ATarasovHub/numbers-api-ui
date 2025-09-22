import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import { PhoneNumberData } from '../../../../../types/providerTypes';
import { phoneNumbersRowStyles } from './PhoneNumbersRow.styles';

interface PhoneNumbersRowProps {
    phone: PhoneNumberData;
}

const PhoneNumbersRow: React.FC<PhoneNumbersRowProps> = ({ phone }) => (
    <TableRow hover>
        <TableCell sx={{ ...phoneNumbersRowStyles.cell, ...phoneNumbersRowStyles.ellipsisCell, ...phoneNumbersRowStyles.numberCell }}>
            {phone.number}
        </TableCell>
        <TableCell sx={{ ...phoneNumbersRowStyles.cell, ...phoneNumbersRowStyles.ellipsisCell, ...phoneNumbersRowStyles.customerCell }}>
            {phone.customer}
        </TableCell>
        <TableCell sx={{ ...phoneNumbersRowStyles.cell, ...phoneNumbersRowStyles.ellipsisCell, ...phoneNumbersRowStyles.techAccountCell }}>
            {phone.techAccount}
        </TableCell>
        <TableCell sx={{ ...phoneNumbersRowStyles.cell, ...phoneNumbersRowStyles.endDateCell }}>
            {phone.endDate ? new Date(phone.endDate).toLocaleDateString() : '-'}
        </TableCell>
        <TableCell sx={{ ...phoneNumbersRowStyles.cell, ...phoneNumbersRowStyles.ellipsisCell, ...phoneNumbersRowStyles.commentCell }}>
            {phone.commentare}
        </TableCell>
        <TableCell sx={{ ...phoneNumbersRowStyles.cell, ...phoneNumbersRowStyles.monthlyCostCell }}>
            {phone.monthlyCost?.toFixed(2) ?? '-'}
        </TableCell>
        <TableCell sx={{ ...phoneNumbersRowStyles.cell, ...phoneNumbersRowStyles.assignedDateCell }}>
            {phone.assignedDate ? new Date(phone.assignedDate).toLocaleDateString() : '-'}
        </TableCell>
    </TableRow>
);

export default PhoneNumbersRow;