import React from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';
import { phoneNumbersLoadingStyles } from './PhoneNumbersLoading.styles';

const PhoneNumbersLoading: React.FC = () => (
    <Paper elevation={1} sx={phoneNumbersLoadingStyles.paper}>
        <Box sx={phoneNumbersLoadingStyles.loaderBox}>
            <CircularProgress size={24} />
        </Box>
    </Paper>
);

export default PhoneNumbersLoading;