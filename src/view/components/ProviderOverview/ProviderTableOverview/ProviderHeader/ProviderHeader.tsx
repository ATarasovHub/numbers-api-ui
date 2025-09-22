import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import { providerHeaderStyles } from './ProviderHeader.styles';

const ProviderHeader: React.FC = () => (
    <TableRow>
        <TableCell sx={{ ...providerHeaderStyles.cell, ...providerHeaderStyles.expandCell }} />
        <TableCell sx={{ ...providerHeaderStyles.cell, ...providerHeaderStyles.providerNameCell }}>Provider Name</TableCell>
        <TableCell sx={{ ...providerHeaderStyles.cell, ...providerHeaderStyles.totalNumbersCell }}>Total Numbers</TableCell>
        <TableCell sx={{ ...providerHeaderStyles.cell, ...providerHeaderStyles.assignedNumbersCell }}>Assigned Numbers</TableCell>
        <TableCell sx={{ ...providerHeaderStyles.cell, ...providerHeaderStyles.notAssignedCell }}>Not Assigned Numbers</TableCell>
        <TableCell sx={{ ...providerHeaderStyles.cell, ...providerHeaderStyles.monthlyCostCell }}>Total Monthly Cost</TableCell>
    </TableRow>
);

export default ProviderHeader;