import React from 'react';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import { CountryStats } from '../../../../utils/domain';
import CountryStatsHeader from '../../../ProviderOverview/CountryStatsOverview/CountryStatsHeader/CountryStatsHeader';
import CountryStatsRow from '../../../ProviderOverview/CountryStatsOverview/CountryStatsRow/CountryStatsRow';
import { useCountryStats } from '../hooks/useCountryStats';
import { countryStatsTableStyles } from './CountryStatsTable.styles';

interface CountryStatsTableProps {
    stats: CountryStats[];
}

const CountryStatsTable: React.FC<CountryStatsTableProps> = ({ stats }) => {
    const { expandedCountries, phoneNumbersData, loadingPhoneNumbers, toggleCountryExpansion } = useCountryStats();

    return (
        <Paper elevation={2} sx={countryStatsTableStyles.paper}>
            <Table size="small" sx={countryStatsTableStyles.table}>
                <TableHead>
                    <CountryStatsHeader />
                </TableHead>
                <TableBody>
                    {stats && stats.length > 0 ? (
                        stats.map((stat) => (
                            <CountryStatsRow
                                key={stat.countryId}
                                stat={stat}
                                isExpanded={!!expandedCountries[stat.countryId]}
                                onToggle={() => toggleCountryExpansion(stat.countryId.toString(), stat.countryName)}
                                phoneNumbers={phoneNumbersData[stat.countryId] || []}
                                loading={!!loadingPhoneNumbers[stat.countryId]}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={countryStatsTableStyles.emptyRowCell}>
                                <Typography>No country statistics</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default CountryStatsTable;