import React from 'react';
import { Box, Typography, Paper, TextField } from '@mui/material';
import { paperStyle, subtitle1Style, gridStyle } from '../../../styles/ProviderAdminPageStyles';

interface ProviderEditFormProps {
    providerDetails: any;
    onDetailChange: (field: string, value: any) => void;
}

const ProviderEditForm: React.FC<ProviderEditFormProps> = ({ providerDetails, onDetailChange }) => {
    if (!providerDetails) {
        return (
            <Paper variant="outlined" sx={paperStyle}>
                <Typography variant="subtitle1" sx={subtitle1Style}>Provider (Edit / Create)</Typography>
                <Typography sx={{color: '#888'}}>Select a provider to see details.</Typography>
            </Paper>
        );
    }

    return (
        <Paper variant="outlined" sx={paperStyle}>
            <Typography variant="subtitle1" sx={subtitle1Style}>Provider (Edit / Create)</Typography>
            <Box sx={gridStyle}>
                <Typography>Provider ID</Typography>
                <TextField size="small" fullWidth value={providerDetails?.providerId || ''} InputProps={{ readOnly: true }} />
                <Typography>Provider Name</Typography>
                <TextField size="small" fullWidth value={providerDetails?.providerName || ''} onChange={e => onDetailChange('providerName', e.target.value)} />
                <Typography>Deleted At</Typography>
                <TextField size="small" fullWidth value={providerDetails?.deletedAt || ''} InputProps={{ readOnly: true }} />
                <Typography>Total Countries</Typography>
                <TextField size="small" fullWidth value={providerDetails?.totalCountries || 0} onChange={e => onDetailChange('totalCountries', e.target.value)} />
                <Typography>Total Numbers</Typography>
                <TextField size="small" fullWidth value={providerDetails?.totalNumbers || 0} onChange={e => onDetailChange('totalNumbers', e.target.value)} />
                <Typography>Total Assigned Numbers</Typography>
                <TextField size="small" fullWidth value={providerDetails?.totalAssignedNumbers || 0} onChange={e => onDetailChange('totalAssignedNumbers', e.target.value)} />
                <Typography>Total Monthly Cost</Typography>
                <TextField size="small" fullWidth value={providerDetails?.totalMonthlyCost || 0} onChange={e => onDetailChange('totalMonthlyCost', e.target.value)} />
            </Box>
        </Paper>
    );
};

export default ProviderEditForm;
