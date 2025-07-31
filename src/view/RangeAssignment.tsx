import React, { useState } from 'react';
import {
    Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
    TextField, Select, MenuItem, Button
} from '@mui/material';

const filterFields = [
    { label: "Comment", type: 'text', select: ['contains', 'equals', 'start with', 'end with'] },
    { label: "Start Date", type: 'date', select: ['equals', 'greater', 'lower'] },
    { label: "End Date", type: 'date', select: ['equals', 'greater', 'lower'] },
    { label: "Number Range From", type: 'number', select: ['equals', 'greater', 'lower'] },
    { label: "Number Range To", type: 'number', select: ['equals', 'greater', 'lower'] },
    { label: "BP", type: 'text', select: ['equals'] },
    { label: "BP Status", type: 'text', select: ['equals'] },
    { label: "Account", type: 'text', select: ['equals'] },
    { label: "Account Status", type: 'text', select: ['equals'] },
    { label: "Provider", type: 'text', select: ['equals'] },
    { label: "MSISDN Service", type: 'text', select: ['equals'] },
];

export function RangeAssignment() {
    const [filter, setFilter] = useState<any>({});

    const handleChange = (key: string, value: any) => {
        setFilter((f: any) => ({ ...f, [key]: value }));
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 1200, m: '40px auto', borderRadius: 2 }}> {/* Increased maxWidth to 1200 */}
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
                                sx={{ minWidth: 95 }}
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
            <Paper sx={{ p: 2, mt: 3, width: '100%' }}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Range Table</Typography>
                <Table size="small" sx={{ width: '100%' }}>
                    <TableHead sx={{ backgroundColor: '#e6f7ff' }}> {/* Light blue background for header */}
                        <TableRow>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '15%' }}>From Number</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '15%' }}>To Number</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '10%' }}>Entries</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '10%' }}>Start Date</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '10%' }}>End Date</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '10%' }}>Comment</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '5%' }}>BP</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '5%' }}>BP Status</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '5%' }}>Account</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '5%' }}>Account Status</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '5%' }}>Provider</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '5%' }}>Service Detail</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '5%' }}>MSISDN Service</TableCell>
                            <TableCell sx={{ fontWeight: '600', fontSize: '0.8rem', width: '5%' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Example row */}
                        <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
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
