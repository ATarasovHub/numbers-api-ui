import React from 'react';
import { Box, Typography, TextField, Select, MenuItem } from '@mui/material';
import { formFieldStyles } from './FormField.styles';

interface FormFieldProps {
    label: string;
    type?: 'text' | 'select' | 'textarea' | 'date';
    value: string;
    onChange: (value: string) => void;
    options?: { value: string; label: string }[];
    placeholder?: string;
    multiline?: boolean;
    minRows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
                                                 label,
                                                 type = 'text',
                                                 value,
                                                 onChange,
                                                 options,
                                                 placeholder,
                                                 multiline = false,
                                                 minRows = 1
                                             }) => {
    const renderField = () => {
        switch (type) {
            case 'select':
                return (
                    <Select
                        size="small"
                        displayEmpty
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        sx={formFieldStyles.input}
                    >
                        <MenuItem value=""><em>{placeholder || 'Select...'}</em></MenuItem>
                        {options?.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                );
            case 'textarea':
                return (
                    <TextField
                        size="small"
                        multiline
                        minRows={minRows}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        sx={formFieldStyles.textarea}
                    />
                );
            case 'date':
                return (
                    <TextField
                        size="small"
                        type="date"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        sx={formFieldStyles.input}
                    />
                );
            default:
                return (
                    <TextField
                        size="small"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        sx={formFieldStyles.input}
                    />
                );
        }
    };

    return (
        <Box sx={multiline ? formFieldStyles.textareaContainer : formFieldStyles.container}>
            <Typography sx={multiline ? formFieldStyles.textareaLabel : formFieldStyles.label}>
                {label}
            </Typography>
            {renderField()}
        </Box>
    );
};

export default FormField;