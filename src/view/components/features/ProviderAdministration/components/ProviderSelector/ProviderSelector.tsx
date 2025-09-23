import React from 'react';
import { Box, Typography, Paper, Select, MenuItem } from '@mui/material';
import { ProviderSelectorProps } from './ProviderSelector.types';
import { styles } from './ProviderSelector.styles';

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
                                                               providers,
                                                               selectedProviderId,
                                                               onSelectProvider
                                                           }) => {
    return (
        <Paper variant="outlined" sx={styles.paper}>
            <Typography variant="subtitle1" sx={styles.subtitle1}>Provider Administration</Typography>
            <Box sx={styles.flexAlignCenterGap1}>
                <Typography sx={styles.label}>Provider</Typography>
                <Select
                    size="small"
                    displayEmpty
                    sx={styles.minWidth200}
                    value={selectedProviderId}
                    onChange={e => onSelectProvider(e.target.value)}
                >
                    <MenuItem value=""><em>click to select</em></MenuItem>
                    {providers.map((p) => (
                        <MenuItem key={p.numberProviderId} value={p.numberProviderId}>
                            {p.numberProviderName}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </Paper>
    );
};

export default ProviderSelector;