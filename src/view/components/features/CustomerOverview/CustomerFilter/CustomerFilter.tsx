import React from 'react';
import { Box, TextField, Paper, Typography } from "@mui/material";
import { customerFilterStyles } from './CustomerFilter.styles';

interface Filters {
    customerName: string;
}

interface CustomerFilterProps {
    filters: Filters;
    onFilterChange: (field: string, value: string) => void;
}

const CustomerFilter: React.FC<CustomerFilterProps> = ({ filters, onFilterChange }) => {
    return (
        <Paper elevation={3} sx={customerFilterStyles.paper}>
            <Box sx={customerFilterStyles.filterContainer}>
                <Typography
                    variant="subtitle2"
                    sx={customerFilterStyles.filterLabel}
                >
                    Filter by:
                </Typography>
                <TextField
                    label="Customer Name"
                    value={filters.customerName}
                    onChange={e => onFilterChange('customerName', e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={customerFilterStyles.textField}
                    placeholder="Start typing to search..."
                />
            </Box>
        </Paper>
    );
};

export default CustomerFilter;