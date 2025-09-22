import React from 'react';
import { Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { subtitle1Style, paperNoMargin, tableSubtitle2 } from '../../../styles/ProviderAdminPageStyles';

interface Provider {
    numberProviderId: string;
    numberProviderName: string;
}

interface CountryStat {
    countryId: string;
    countryName: string;
    countryCode: string;
    totalNumbers: number;
    assignedNumbers: number;
    totalMonthlyCost: number;
}

interface CurrentRangesTableProps {
    selectedProviderId: string;
    providers: Provider[];
    countryStats: CountryStat[] | undefined;
}

const CurrentRangesTable: React.FC<CurrentRangesTableProps> = ({ selectedProviderId, providers, countryStats }) => {
    const selectedProviderName = providers.find(p => p.numberProviderId === selectedProviderId)?.numberProviderName || '—';

    return (
        <Paper variant="outlined" sx={paperNoMargin}>
            <Typography variant="subtitle1" sx={subtitle1Style}>Current Ranges</Typography>
            {selectedProviderId && (
                <Typography variant="subtitle2" sx={tableSubtitle2}>
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
