import React from 'react';
import { TextField } from '@mui/material';

interface NumberInputFieldProps {
    value: string;
    onChange: (value: string) => void;
}

export const NumberInputField: React.FC<NumberInputFieldProps> = ({ value, onChange }) => {
    return (
        <TextField
            label="Numbers (comma, space or newline separated)"
            placeholder="+491761234567,+491761234568  +380501234567"
            multiline
            rows={5}
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{ mb: 2 }}
        />
    );
};