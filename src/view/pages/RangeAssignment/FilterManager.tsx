import React, { useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, Button, CircularProgress, Autocomplete, AutocompleteRenderInputParams } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CustomerData, TechAccountData } from './types';
import { styles } from './styles';

const basicFilterFields = [
    { label: "Customer Name", type: 'autocomplete' },
    { label: "Assignment Status", type: 'select', options: ['Assigned', 'Unassigned'] },
    { label: "Tech Account Name", type: 'autocomplete' }
];

const advancedFilterFields = [
    { label: "Number Range From", type: 'text' },
    { label: "Number Range To", type: 'text' },
    { label: "Start Date", type: 'date' },
    { label: "End Date", type: 'date' },
    { label: "Tech Account Status", type: 'select', options: ['Active', 'Deleted'] },
    { label: "Service Detail", type: 'text' },
    { label: "Comment", type: 'text' }
];

interface FilterManagerProps {
    filter: any;
    country: string;
    loading: boolean;
    isInitialSearch: boolean;
    customerOptions: CustomerData[];
    techAccountOptions: TechAccountData[];
    customerLoading: boolean;
    techAccountLoading: boolean;
    onFilterChange: (key: string, value: any) => void;
    onCountryChange: (value: string) => void;
    onSearch: () => void;
    onExport: () => void;
    onDebugExport: () => void;
    fetchCustomerOptions: (searchText: string, page: number, reset: boolean) => void;
    fetchTechAccountOptions: (searchText: string, page: number, reset: boolean) => void;
    loadMoreCustomers: () => void;
    loadMoreTechAccounts: () => void;
    customerPage: number;
    techAccountPage: number;
    setCurrentCustomerSearch: (value: string) => void;
    setCurrentTechAccountSearch: (value: string) => void;
}

const FilterManager: React.FC<FilterManagerProps> = (props) => {
    const {
        filter, country, loading, isInitialSearch, customerOptions, techAccountOptions,
        customerLoading, techAccountLoading, onFilterChange, onCountryChange, onSearch,
        onExport, onDebugExport, fetchCustomerOptions, fetchTechAccountOptions,
        loadMoreCustomers, loadMoreTechAccounts,
        setCurrentCustomerSearch, setCurrentTechAccountSearch
    } = props;

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const toggleAdvancedFilters = () => {
        setShowAdvancedFilters(!showAdvancedFilters);
    };

    const filterFields = showAdvancedFilters
        ? [...basicFilterFields, ...advancedFilterFields]
        : basicFilterFields;

    return (
        <Box sx={{ mb: 3 }}>
            <Typography sx={styles.sectionTitle}>Search</Typography>
            <Box sx={{ mb: 2 }}>
                <TextField
                    size="small"
                    label="Country"
                    value={country}
                    onChange={(e) => onCountryChange(e.target.value)}
                    sx={{ width: 300 }}
                    placeholder="Leave empty to search all countries"
                />
            </Box>
            <Box sx={styles.filterContainer}>
                {filterFields.map((field) => (
                    <Box key={field.label} sx={styles.filterRow}>
                        {field.type === 'autocomplete' ? (
                            <Box sx={{ position: 'relative', flexGrow: 1 }}>
                                <Autocomplete
                                    freeSolo
                                    options={field.label === "Customer Name" ? customerOptions : techAccountOptions}
                                    loading={field.label === "Customer Name" ? customerLoading : techAccountLoading}
                                    onInputChange={(event, value) => {
                                        onFilterChange(field.label, value);
                                        if (field.label === "Customer Name") {
                                            setCurrentCustomerSearch(value);
                                            fetchCustomerOptions(value, 0, true);
                                        } else {
                                            setCurrentTechAccountSearch(value);
                                            fetchTechAccountOptions(value, 0, true);
                                        }
                                    }}
                                    value={filter[field.label] || null}
                                    onChange={(event, value) => {
                                        const selectedValue = typeof value === 'string' ? value : (value as any)?.customerName || (value as any)?.techAccountName || '';
                                        onFilterChange(field.label, selectedValue);
                                    }}
                                    getOptionLabel={(option) => typeof option === 'string' ? option : (option as any).customerName || (option as any).techAccountName}
                                    renderInput={(params: AutocompleteRenderInputParams) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            label={field.label}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {(field.label === "Customer Name" ? customerLoading : techAccountLoading) && <CircularProgress color="inherit" size={20} sx={styles.autocompleteLoading} />}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                    ListboxProps={{
                                        onScroll: (event: React.SyntheticEvent) => {
                                            const listboxNode = event.currentTarget as HTMLElement;
                                            if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 5) {
                                                if (field.label === "Customer Name") loadMoreCustomers();
                                                else loadMoreTechAccounts();
                                            }
                                        },
                                    }}
                                />
                            </Box>
                        ) : field.type === 'select' ? (
                            <Select
                                size="small"
                                value={filter[field.label] || ''}
                                onChange={(e) => onFilterChange(field.label, e.target.value)}
                                displayEmpty
                                sx={{ flexGrow: 1 }}
                            >
                                <MenuItem value=""><em>Select {field.label}</em></MenuItem>
                                {field.options?.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                            </Select>
                        ) : (
                            <TextField
                                size="small"
                                type={field.type}
                                label={field.label}
                                value={filter[field.label] ?? ''}
                                onChange={e => onFilterChange(field.label, e.target.value)}
                                sx={{ flexGrow: 1 }}
                                InputLabelProps={{ shrink: field.type === 'date' ? true : undefined }}
                            />
                        )}
                    </Box>
                ))}
            </Box>
            <Box sx={styles.buttonContainer}>
                <Button variant="outlined" onClick={toggleAdvancedFilters}>
                    {showAdvancedFilters ? 'Hide Advanced' : 'Show Advanced'}
                </Button>
                <Button variant="contained" onClick={onSearch} disabled={loading && isInitialSearch} startIcon={loading && isInitialSearch ? <CircularProgress size={24} /> : <SearchIcon />}>
                    {loading && isInitialSearch ? 'Searching...' : 'Search'}
                </Button>
                <Button onClick={onExport}>
                    Export to Excel
                </Button>
                <Button onClick={onDebugExport} color="secondary">
                    Debug Export
                </Button>
            </Box>
        </Box>
    );
};

export default FilterManager;
