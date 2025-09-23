import React from 'react';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { customerCountriesTableStyles } from './CustomerCountriesTable.styles';

interface CustomerCountriesTableProps {
    countries: any[];
}

export const CustomerCountriesTable: React.FC<CustomerCountriesTableProps> = ({ countries }) => {
    return (
        <Paper elevation={2} sx={customerCountriesTableStyles.paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Total Accounts</TableCell>
                        <TableCell>Total Numbers</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {countries.length > 0 ? (
                        countries.map(country => (
                            <TableRow key={country.countryId} hover>
                                <TableCell>{country.countryId}</TableCell>
                                <TableCell>{country.countryName}</TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat().format(country.totalAccounts)}
                                </TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat().format(country.totalNumbers)}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                align="center"
                                sx={customerCountriesTableStyles.noDataCell}
                            >
                                No countries found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
};