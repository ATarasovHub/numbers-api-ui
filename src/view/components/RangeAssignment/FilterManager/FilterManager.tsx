import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CustomerData, TechAccountData } from '../../../types/rangeAssignmentTypes';
import { styles } from './FilterManager.styles';
import { basicFilterFields, advancedFilterFields } from './filterFields';
import CustomTextField from '../../RangeAssignment/FilterManager/StyledTextField';

// Расширяем тип для поддержки индексной сигнатуры
interface FilterState {
    [key: string]: string | undefined;
    "Customer Name"?: string;
    "Assignment Status"?: string;
    "Tech Account Name"?: string;
    "Number Range From"?: string;
    "Number Range To"?: string;
    "Start Date"?: string;
    "End Date"?: string;
    "Tech Account Status"?: string;
    "Service Detail"?: string;
    "Comment"?: string;
}

interface FilterManagerProps {
    filter: FilterState;
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
    fetchCustomerOptions: (searchText: string, page: number, reset: boolean) => void;
    fetchTechAccountOptions: (searchText: string, page: number, reset: boolean) => void;
    loadMoreCustomers: () => void;
    loadMoreTechAccounts: () => void;
    setCurrentCustomerSearch: (value: string) => void;
    setCurrentTechAccountSearch: (value: string) => void;
}

const FilterManager: React.FC<FilterManagerProps> = (props) => {
    const {
        filter, country, loading, isInitialSearch, customerOptions, techAccountOptions,
        customerLoading, techAccountLoading, onFilterChange, onCountryChange, onSearch,
        onExport, fetchCustomerOptions, fetchTechAccountOptions,
        setCurrentCustomerSearch, setCurrentTechAccountSearch
    } = props;

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const toggleAdvancedFilters = () => {
        setShowAdvancedFilters(!showAdvancedFilters);
    };

    const filterFields = useMemo(() =>
            showAdvancedFilters
                ? [...basicFilterFields, ...advancedFilterFields]
                : basicFilterFields,
        [showAdvancedFilters]
    );

    const getOptionLabel = (option: any, fieldLabel: string): string => {
        if (typeof option === 'string') return option;

        if (fieldLabel === "Customer Name" && option && typeof option === 'object' && 'customerName' in option) {
            return (option as CustomerData).customerName || '';
        }

        if (fieldLabel === "Tech Account Name" && option && typeof option === 'object' && 'techAccountName' in option) {
            return (option as TechAccountData).techAccountName || '';
        }

        return '';
    };

    const getOptionsForField = (fieldLabel: string): readonly CustomerData[] | readonly TechAccountData[] => {
        return fieldLabel === "Customer Name" ? customerOptions : techAccountOptions;
    };

    const isLoadingForField = (fieldLabel: string) => {
        return fieldLabel === "Customer Name" ? customerLoading : techAccountLoading;
    };

    const handleAutocompleteInputChange = (fieldLabel: string, value: string) => {
        onFilterChange(fieldLabel, value);
        if (fieldLabel === "Customer Name") {
            setCurrentCustomerSearch(value);
            fetchCustomerOptions(value, 0, true);
        } else {
            setCurrentTechAccountSearch(value);
            fetchTechAccountOptions(value, 0, true);
        }
    };

    const handleAutocompleteChange = (fieldLabel: string, value: any) => {
        let selectedValue = '';
        if (typeof value === 'string') {
            selectedValue = value;
        } else if (value && typeof value === 'object') {
            selectedValue = fieldLabel === "Customer Name"
                ? (value.customerName || '')
                : (value.techAccountName || '');
        }
        onFilterChange(fieldLabel, selectedValue);
    };

    return (
        <Box sx={styles.container}>
            <Typography sx={styles.sectionTitle}>Search</Typography>
            <Box sx={styles.countryField}>
                <CustomTextField
                    label="Country"
                    value={country}
                    onChange={(e) => onCountryChange(e.target.value)}
                    placeholder="Leave empty to search all countries"
                />
            </Box>
            <Box sx={styles.filterContainer}>
                {filterFields.map((field) => (
                    <Box key={field.label} sx={styles.filterRow}>
                        {field.type === 'autocomplete' ? (
                            <Autocomplete
                                freeSolo
                                options={getOptionsForField(field.label) as any}
                                loading={isLoadingForField(field.label)}
                                onInputChange={(event, value) => {
                                    handleAutocompleteInputChange(field.label, value);
                                }}
                                value={filter[field.label] || null}
                                onChange={(event, value) => {
                                    handleAutocompleteChange(field.label, value);
                                }}
                                getOptionLabel={(option) => getOptionLabel(option, field.label)}
                                renderInput={(params) => (
                                    <CustomTextField
                                        {...params}
                                        label={field.label}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isLoadingForField(field.label) && (
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={20}
                                                            sx={styles.autocompleteLoading}
                                                        />
                                                    )}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        ) : field.type === 'select' ? (
                            <Select
                                size="small"
                                value={filter[field.label] || ''}
                                onChange={(e) => onFilterChange(field.label, e.target.value)}
                                displayEmpty
                                sx={{ width: 300 }}
                            >
                                <MenuItem value="">
                                    <em>Select {field.label}</em>
                                </MenuItem>
                                {field.options?.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <CustomTextField
                                type={field.type}
                                label={field.label}
                                value={filter[field.label] ?? ''}
                                onChange={e => onFilterChange(field.label, e.target.value)}
                                InputLabelProps={{
                                    shrink: field.type === 'date' ? true : undefined
                                }}
                                sx={{ width: 300 }}
                            />
                        )}
                    </Box>
                ))}
            </Box>
            <Box sx={styles.buttonContainer}>
                <Button variant="outlined" onClick={toggleAdvancedFilters}>
                    {showAdvancedFilters ? 'Hide Advanced' : 'Show Advanced'}
                </Button>
                <Button
                    variant="contained"
                    onClick={onSearch}
                    disabled={loading && isInitialSearch}
                    startIcon={loading && isInitialSearch ? <CircularProgress size={24} /> : <SearchIcon />}
                >
                    {loading && isInitialSearch ? 'Searching...' : 'Search'}
                </Button>
                <Button
                    variant="outlined"
                    onClick={onExport}
                >
                    Export to Excel
                </Button>
            </Box>
        </Box>
    );
};

export default FilterManager;