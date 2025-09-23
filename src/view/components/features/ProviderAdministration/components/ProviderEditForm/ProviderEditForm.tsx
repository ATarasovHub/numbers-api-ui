import React from 'react';
import { Box, Typography, Paper, TextField } from '@mui/material';
import { ProviderEditFormProps } from './ProviderEditForm.types';
import { styles } from './ProviderEditForm.styles';

const ProviderEditForm: React.FC<ProviderEditFormProps> = ({ providerDetails, onDetailChange }) => {
    if (!providerDetails) {
        return (
            <Paper variant="outlined" sx={styles.paper}>
                <Typography variant="subtitle1" sx={styles.subtitle1}>Provider (Edit / Create)</Typography>
                <Typography sx={styles.placeholderText}>Select a provider to see details.</Typography>
            </Paper>
        );
    }

    return (
        <Paper variant="outlined" sx={styles.paper}>
            <Typography variant="subtitle1" sx={styles.subtitle1}>Provider (Edit / Create)</Typography>
            <Box sx={styles.grid}>
                <Typography>Provider ID</Typography>
                <TextField
                    size="small"
                    fullWidth
                    value={providerDetails?.providerId || ''}
                    InputProps={{ readOnly: true }}
                />
                <Typography>Provider Name</Typography>
                <TextField
                    size="small"
                    fullWidth
                    value={providerDetails?.providerName || ''}
                    onChange={e => onDetailChange('providerName', e.target.value)}
                />
                <Typography>Deleted At</Typography>
                <TextField
                    size="small"
                    fullWidth
                    value={providerDetails?.deletedAt || ''}
                    InputProps={{ readOnly: true }}
                />
                <Typography>Total Countries</Typography>
                <TextField
                    size="small"
                    fullWidth
                    value={providerDetails?.totalCountries || 0}
                    onChange={e => onDetailChange('totalCountries', e.target.value)}
                />
                <Typography>Total Numbers</Typography>
                <TextField
                    size="small"
                    fullWidth
                    value={providerDetails?.totalNumbers || 0}
                    onChange={e => onDetailChange('totalNumbers', e.target.value)}
                />
                <Typography>Total Assigned Numbers</Typography>
                <TextField
                    size="small"
                    fullWidth
                    value={providerDetails?.totalAssignedNumbers || 0}
                    onChange={e => onDetailChange('totalAssignedNumbers', e.target.value)}
                />
                <Typography>Total Monthly Cost</Typography>
                <TextField
                    size="small"
                    fullWidth
                    value={providerDetails?.totalMonthlyCost || 0}
                    onChange={e => onDetailChange('totalMonthlyCost', e.target.value)}
                />
            </Box>
        </Paper>
    );
};

export default ProviderEditForm;