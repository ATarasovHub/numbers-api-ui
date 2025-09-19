import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: 300,
    '& .MuiInputBase-root': {
        height: 40,
        fontSize: '0.9rem',
        backgroundColor: 'background.paper',
    },
    '& .MuiInputLabel-root': {
        fontSize: '0.85rem',
        color: 'text.secondary',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'divider',
        },
        '&:hover fieldset': {
            borderColor: 'primary.main',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
        },
    },
}));

const CustomTextField: React.FC<TextFieldProps> = (props) => {
    return <StyledTextField size="small" variant="outlined" {...props} />;
};

export default CustomTextField;