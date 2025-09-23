import React from 'react';
import {
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import ProvisioningActions from './ProvisioningRow/ProvisioningActions/ProvisioningActions';
import { TableWrapper } from './ProvisioningTable.styles';

export interface ProvisioningRow {
    provider: string;
    bp: string;
    comment: string;
    requestedNumbers: number;
    date: string;
}

interface ProvisioningTableProps {
    provisioning: ProvisioningRow[];
    onDelete?: (row: ProvisioningRow) => void;
    onEdit?: (row: ProvisioningRow) => void;
}

const ProvisioningTable: React.FC<ProvisioningTableProps> = ({ provisioning, onDelete, onEdit }) => {
    return (
        <TableWrapper>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Provisioning
            </Typography>
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
                                <ProvisioningActions
                                    onDelete={() => onDelete?.(row)}
                                    onEdit={() => onEdit?.(row)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableWrapper>
    );
};

export default ProvisioningTable;