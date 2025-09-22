import React from 'react';
import { Box, Typography, TextField, Select, MenuItem } from '@mui/material';
import { providerFiltersStyles } from './ProviderFilters.styles';

interface ProviderFiltersProps {
    filters: any;
    onFilterChange: (field: string, value: string) => void;
}

const ProviderFilters: React.FC<ProviderFiltersProps> = ({ filters, onFilterChange }) => (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
        <Typography variant="subtitle2" sx={providerFiltersStyles.filterLabel}>Filter by:</Typography>

        <TextField
            label="Provider Name"
            value={filters.providerName}
            onChange={e => onFilterChange('providerName', e.target.value)}
            variant="outlined"
            size="small"
            sx={providerFiltersStyles.textField}
        />

        <Box sx={providerFiltersStyles.filterGroup}>
            <Select
                value={filters.totalNumbersOp}
                onChange={e => onFilterChange('totalNumbersOp', e.target.value as string)}
                variant="outlined"
                size="small"
                sx={providerFiltersStyles.select}
            >
                <MenuItem value=">=">&ge;</MenuItem>
                <MenuItem value="<=">&le;</MenuItem>
            </Select>
            <TextField
                label="Total Numbers"
                value={filters.totalNumbers}
                onChange={e => onFilterChange('totalNumbers', e.target.value)}
                variant="outlined"
                size="small"
                type="number"
                sx={providerFiltersStyles.numberTextField}
            />
        </Box>

        <Box sx={providerFiltersStyles.filterGroup}>
            <Select
                value={filters.totalAssignedNumbersOp}
                onChange={e => onFilterChange('totalAssignedNumbersOp', e.target.value as string)}
                variant="outlined"
                size="small"
                sx={providerFiltersStyles.select}
            >
                <MenuItem value=">=">&ge;</MenuItem>
                <MenuItem value="<=">&le;</MenuItem>
            </Select>
            <TextField
                label="Assigned Numbers"
                value={filters.totalAssignedNumbers}
                onChange={e => onFilterChange('totalAssignedNumbers', e.target.value)}
                variant="outlined"
                size="small"
                type="number"
                sx={providerFiltersStyles.numberTextField}
            />
        </Box>

        <Box sx={providerFiltersStyles.filterGroup}>
            <Select
                value={filters.totalMonthlyCostOp}
                onChange={e => onFilterChange('totalMonthlyCostOp', e.target.value as string)}
                variant="outlined"
                size="small"
                sx={providerFiltersStyles.select}
            >
                <MenuItem value=">=">&ge;</MenuItem>
                <MenuItem value="<=">&le;</MenuItem>
            </Select>
            <TextField
                label="Monthly Cost"
                value={filters.totalMonthlyCost}
                onChange={e => onFilterChange('totalMonthlyCost', e.target.value)}
                variant="outlined"
                size="small"
                type="number"
                sx={providerFiltersStyles.numberTextField}
            />
        </Box>
    </Box>
);

export default ProviderFilters;