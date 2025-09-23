import React from 'react';
import { Box, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress } from '@mui/material';
import { NumberProvider } from '../../../../../../../utils/domain';
import ProviderHeader from '../ProviderHeader/ProviderHeader';
import ProviderRow from '../ProviderRow/ProviderRow';
import { providerTableStyles } from './ProviderTable.styles';

interface ProviderTableProps {
    providers: NumberProvider[];
    loading: boolean;
}

const ProviderTable: React.FC<ProviderTableProps> = ({ providers, loading }) => (
    <Box sx={providerTableStyles.tableContainer}>
        <Table sx={providerTableStyles.table} aria-label="providers table">
            <TableHead>
                <ProviderHeader />
            </TableHead>
            <TableBody>
                {providers.map(p => (
                    <ProviderRow key={p.providerId} provider={p} />
                ))}
                {providers.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} align="center" sx={providerTableStyles.emptyCell}>
                            <CircularProgress size={32} />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </Box>
);

export default ProviderTable;