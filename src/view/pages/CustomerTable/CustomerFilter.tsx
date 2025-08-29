import React from 'react';
import { Box, Typography, TextField, Select, MenuItem, Paper } from "@mui/material";

interface Filters {
    customerName: string;
    totalNumbers: string;
    totalNumbersOp: string;
}

interface CustomerFilterProps {
    filters: Filters;
    onFilterChange: (field: string, value: string) => void;
}

const CustomerFilter: React.FC<CustomerFilterProps> = ({ filters, onFilterChange }) => {
    return (
        <Paper elevation={3} sx={{ p: 2.5, mb: 3, borderRadius: 2.5 }}>
            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
                <Typography variant="subtitle2" sx={{ minWidth: '100px', fontWeight: 600 }}>
                    Filter by:
                </Typography>
                <TextField
                    label="Customer Name"
                    value={filters.customerName}
                    onChange={e => onFilterChange('customerName', e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 220 }}
                />
                <Box display="flex" alignItems="center" gap={1}>
                    <Select
                        value={filters.totalNumbersOp}
                        onChange={e => onFilterChange('totalNumbersOp', e.target.value as string)}
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 70 }}
                    >
                        <MenuItem value=">=">&ge;</MenuItem>
                        <MenuItem value="<=">&le;</MenuItem>
                    </Select>
                    <TextField
                        label="Total Numbers"
                        value={filters.totalNumbers}
                        onChange={e => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) {
                                onFilterChange('totalNumbers', val);
                            }
                        }}
                        variant="outlined"
                        size="small"
                        type="text"
                        sx={{ minWidth: 150 }}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default CustomerFilter;
