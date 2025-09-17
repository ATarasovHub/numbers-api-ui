import React from 'react';
import { Box, TextField, Paper, Typography } from "@mui/material";

interface Filters {
    customerName: string;
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
                    sx={{ minWidth: 300 }}
                    placeholder="Start typing to search..."
                />
            </Box>
        </Paper>
    );
};

export default CustomerFilter;