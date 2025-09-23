import React from 'react';
import { Typography, Select, MenuItem } from '@mui/material';
import { searchFieldStyles } from './SearchField.styles';

interface SearchFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    fieldType?: 'default' | 'provider' | 'bp';
}

const SearchField: React.FC<SearchFieldProps> = ({
                                                     label,
                                                     value,
                                                     onChange,
                                                     options,
                                                     placeholder = 'Select...',
                                                     fieldType = 'default'
                                                 }) => {
    const getLabelStyle = () => {
        switch (fieldType) {
            case 'provider':
                return searchFieldStyles.providerLabel;
            case 'bp':
                return searchFieldStyles.bpLabel;
            default:
                return searchFieldStyles.label;
        }
    };

    const getSelectStyle = () => {
        switch (fieldType) {
            case 'provider':
                return searchFieldStyles.providerSelect;
            case 'bp':
                return searchFieldStyles.bpSelect;
            default:
                return searchFieldStyles.select;
        }
    };

    return (
        <div style={searchFieldStyles.container}>
            <Typography sx={getLabelStyle()}>{label}</Typography>
            <Select
                size="small"
                displayEmpty
                value={value}
                onChange={e => onChange(e.target.value)}
                sx={getSelectStyle()}
            >
                <MenuItem value=""><em>{placeholder}</em></MenuItem>
                {options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

export default SearchField;