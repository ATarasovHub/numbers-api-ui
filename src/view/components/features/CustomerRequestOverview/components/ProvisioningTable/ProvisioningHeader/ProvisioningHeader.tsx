import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import { provisioningHeaderStyles } from './ProvisioningHeader.styles';

const ProvisioningHeader: React.FC = () => (
    <TableRow>
        <TableCell sx={provisioningHeaderStyles.cell}>Provider</TableCell>
        <TableCell sx={provisioningHeaderStyles.cell}>BP</TableCell>
        <TableCell sx={provisioningHeaderStyles.cell}>Comment</TableCell>
        <TableCell sx={provisioningHeaderStyles.cell}>Requested Numbers</TableCell>
        <TableCell sx={provisioningHeaderStyles.cell}>Date</TableCell>
        <TableCell sx={provisioningHeaderStyles.cell}>Actions</TableCell>
    </TableRow>
);

export default ProvisioningHeader;