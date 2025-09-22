import React from 'react';
import { Box, Typography, Paper, Select, MenuItem } from '@mui/material';
import { paperStyle, subtitle1Style, flexAlignCenterGap1, minWidth200 } from '../../../styles/ProviderAdminPageStyles';

interface Provider {
    numberProviderId: string;
    numberProviderName: string;
}

interface ProviderSelectorProps {
    providers: Provider[];
    selectedProviderId: string;
    onSelectProvider: (providerId: string) => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({ providers, selectedProviderId, onSelectProvider }) => {
    return (
        <Paper variant="outlined" sx={paperStyle}>
            <Typography variant="subtitle1" sx={subtitle1Style}>Provider Administration</Typography>
            <Box sx={flexAlignCenterGap1}>
                <Typography sx={{ minWidth: 70 }}>Provider</Typography>
                <Select
                    size="small"
                    displayEmpty
                    sx={minWidth200}
                    value={selectedProviderId}
                    onChange={e => onSelectProvider(e.target.value)}
                >
                    <MenuItem value=""><em>click to select</em></MenuItem>
                    {providers.map((p) => (
                        <MenuItem key={p.numberProviderId} value={p.numberProviderId}>{p.numberProviderName}</MenuItem>
                    ))}
                </Select>
            </Box>
        </Paper>
    );
};

export default ProviderSelector;
