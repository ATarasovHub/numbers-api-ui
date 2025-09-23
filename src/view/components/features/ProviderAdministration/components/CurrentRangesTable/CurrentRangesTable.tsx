import React from 'react';
import {
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { CurrentRangesTableProps } from './CurrentRangesTable.types';
import { styles } from './CurrentRangesTable.styles';

const CurrentRangesTable: React.FC<CurrentRangesTableProps> = ({
                                                                   selectedProviderId,
                                                                   providers,
                                                                   countryStats
                                                               }) => {
    const selectedProviderName = providers.find(p => p.numberProviderId === selectedProviderId)?.numberProviderName || '—';

    return (
        <Paper variant="outlined" sx={styles.paper}>
            <Typography variant="subtitle1" sx={styles.subtitle1}>Current Ranges</Typography>
            {selectedProviderId && (
                <Typography variant="subtitle2" sx={styles.providerSubtitle}>
                    Provider: {selectedProviderName}
                </Typography>
            )}
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Country Id</TableCell>
                        <TableCell>Country Name</TableCell>
                        <TableCell>Country Code</TableCell>
                        <TableCell>Total Numbers</TableCell>
                        <TableCell>Assigned Numbers</TableCell>
                        <TableCell>Monthly Cost</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {countryStats?.map((cs) => (
                        <TableRow key={cs.countryId}>
                            <TableCell>{cs.countryId}</TableCell>
                            <TableCell>{cs.countryName}</TableCell>
                            <TableCell>{cs.countryCode}</TableCell>
                            <TableCell>{cs.totalNumbers}</TableCell>
                            <TableCell>{cs.assignedNumbers}</TableCell>
                            <TableCell>{cs.totalMonthlyCost}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default CurrentRangesTable;