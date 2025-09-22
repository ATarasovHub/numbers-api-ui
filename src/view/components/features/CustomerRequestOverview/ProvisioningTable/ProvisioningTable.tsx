import React from 'react';
import { Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

interface ProvisioningRow {
    provider: string;
    bp: string;
    comment: string;
    requestedNumbers: number;
    date: string;
}

interface ProvisioningTableProps {
    provisioning: ProvisioningRow[];
}

const ProvisioningTable: React.FC<ProvisioningTableProps> = ({ provisioning }) => {
    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Provisioning</Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Provider</TableCell>
                        <TableCell>BP</TableCell>
                        <TableCell>Comment</TableCell>
                        <TableCell>Requested Numbers</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {provisioning.map((row, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{row.provider}</TableCell>
                            <TableCell>{row.bp}</TableCell>
                            <TableCell>{row.comment}</TableCell>
                            <TableCell>{row.requestedNumbers}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>
                                <Button size="small" color="error">✗</Button>
                                <Button size="small">✎</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default ProvisioningTable;
