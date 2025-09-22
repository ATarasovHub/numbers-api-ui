import React from 'react';
import { TableRow, TableCell, Button } from '@mui/material';
import { ProvisioningRowProps } from '../ProvisioningTable.types';
import { provisioningRowStyles } from './ProvisioningRow.styles';

const ProvisioningRow: React.FC<ProvisioningRowProps> = ({ row, onEdit, onDelete }) => (
    <TableRow>
        <TableCell>{row.provider}</TableCell>
        <TableCell>{row.bp}</TableCell>
        <TableCell>{row.comment}</TableCell>
        <TableCell>{row.requestedNumbers}</TableCell>
        <TableCell>{row.date}</TableCell>
        <TableCell>
            <Button
                size="small"
                color="error"
                sx={provisioningRowStyles.actionButton}
                onClick={onDelete}
            >
                ✗
            </Button>
            <Button
                size="small"
                sx={provisioningRowStyles.actionButton}
                onClick={onEdit}
            >
                ✎
            </Button>
        </TableCell>
    </TableRow>
);

export default ProvisioningRow;