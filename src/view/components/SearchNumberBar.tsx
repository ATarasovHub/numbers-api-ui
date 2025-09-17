import React from 'react';
import { Box, TextField, Button } from '@mui/material';

interface SearchNumberBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearchSubmit: () => void;
    disabled?: boolean;
    placeholder?: string;
}

export const SearchNumberBar: React.FC<SearchNumberBarProps> = ({
                                                                    value,
                                                                    onChange,
                                                                    onSearchSubmit,
                                                                    disabled = false,
                                                                    placeholder = "Enter number to find...",
                                                                }) => {
    return (
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
                label="Search Number"
                variant="outlined"
                size="small"
                value={value}
                onChange={e => onChange(e.target.value)}
                fullWidth
                placeholder={placeholder}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button
                variant="contained"
                onClick={onSearchSubmit}
                disabled={disabled || !value.trim()}
                sx={{ minWidth: 80 }}
            >
                Find
            </Button>
        </Box>
    );
};