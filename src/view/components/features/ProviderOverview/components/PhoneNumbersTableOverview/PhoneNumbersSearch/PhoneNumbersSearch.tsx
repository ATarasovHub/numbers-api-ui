import React from 'react';
import { Box, TextField } from '@mui/material';
import { phoneNumbersTableStyles } from '../PhoneNumbersTable/PhoneNumbersTable.styles';
import { phoneNumbersSearchStyles } from './PhoneNumbersSearch.styles';

interface PhoneNumbersSearchProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

const PhoneNumbersSearch: React.FC<PhoneNumbersSearchProps> = ({ searchQuery, onSearchChange }) => (
    <Box sx={phoneNumbersTableStyles.headerBox}>
        <TextField
            label="Search by Number"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
            size="small"
            sx={phoneNumbersSearchStyles.textField}
        />
    </Box>
);

export default PhoneNumbersSearch;