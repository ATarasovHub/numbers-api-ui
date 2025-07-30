import React, { useState } from 'react';
import {
    Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
    TextField, Select, MenuItem, Button
} from '@mui/material';

// Добавляем все операторы для каждого поля
const filterFields = [
    { label: "Comment", type: 'text', select: ['equals', 'contains', 'greater', 'lower'] },
    { label: "Start Date", type: 'date', select: ['equals', 'greater', 'lower'] },
    { label: "End Date", type: 'date', select: ['equals', 'greater', 'lower'] },
    { label: "Number Range From", type: 'number', select: ['equals', 'greater', 'lower'] },
    { label: "Number Range To", type: 'number', select: ['equals', 'greater', 'lower'] },
    { label: "BP", type: 'text', select: ['equals', 'contains', 'greater', 'lower'] },
    { label: "BP Status", type: 'text', select: ['equals', 'contains', 'greater', 'lower'] },
    { label: "Account", type: 'text', select: ['equals', 'contains', 'greater', 'lower'] },
    { label: "Account Status", type: 'text', select: ['equals', 'contains', 'greater', 'lower'] },
    { label: "Provider", type: 'text', select: ['equals', 'contains', 'greater', 'lower'] },
    { label: "MSISDN Service", type: 'text', select: ['equals', 'contains', 'greater', 'lower'] },
];

export function RangeAssignment() {
    const [filter, setFilter] = useState<any>({});

    const handleChange = (key: string, value: any) => {
        setFilter((f: any) => ({ ...f, [key]: value }));
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 1100, m: '40px auto', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Range Assignment</Typography>
            <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600 }}>search</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filterFields.map(field => (
                        <Box key={field.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Select
                                size="small"
                                value={filter[field.label + '_op'] ?? field.select[0]}
                                onChange={e => handleChange(field.label + '_op', e.target.value)}
                                sx={{ minWidth: 120 }}
                            >
                                {field.select.map(v =>
                                    <MenuItem value={v} key={v}>{v}</MenuItem>
                                )}
                            </Select>
                            <TextField
                                size="small"
                                type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                                label={field.label}
                                value={filter[field.label] ?? ''}
                                onChange={e => handleChange(field.label, e.target.value)}
                                sx={{ flexGrow: 1 }}
                                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                            />
                        </Box>
                    ))}
                </Box>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button variant="contained" sx={{ mr: 1 }}>Search</Button>
                    <Button>Print the result</Button>
                </Box>
            </Box>
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Range Table</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>From Number</TableCell>
                            <TableCell>To Number</TableCell>
                            <TableCell>Entries</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>BP</TableCell>
                            <TableCell>BP Status</TableCell>
                            <TableCell>Account</TableCell>
                            <TableCell>Account Status</TableCell>
                            <TableCell>Provider</TableCell>
                            <TableCell>Service Detail</TableCell>
                            <TableCell>MSISDN Service</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>88001001</TableCell>
                            <TableCell>88002000</TableCell>
                            <TableCell>1000</TableCell>
                            <TableCell>2023-01-01</TableCell>
                            <TableCell>2025-01-01</TableCell>
                            <TableCell>Lorem ipsum</TableCell>
                            <TableCell>BP01</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Acc01</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Provider1</TableCell>
                            <TableCell>Detail1</TableCell>
                            <TableCell>ServiceX</TableCell>
                            <TableCell>Used</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </Paper>
    );
}