import React, { useState } from 'react';
import { Box, Typography, Paper, Select, MenuItem, Button } from '@mui/material';
import provisioningTypesData from '../../mocks/data/provisioningTypes';

const mockBps = [
    { id: 'twilio', name: 'twilio' },
    { id: 'bp2', name: 'bp2' },
];

interface Provider {
    providerId: string;
    providerName: string;
}

interface SearchCustomerRequestFormProps {
    providers: Provider[];
    onSearch: (params: { provider: string, bp: string }) => void;
}

const SearchCustomerRequestForm: React.FC<SearchCustomerRequestFormProps> = ({ providers, onSearch }) => {
    const [searchProvisioningType, setSearchProvisioningType] = useState('');
    const [searchProvider, setSearchProvider] = useState('');
    const [searchBp, setSearchBp] = useState('');

    const handleSearchClick = () => {
        onSearch({
            provider: searchProvider,
            bp: searchBp,
        });
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>search</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ minWidth: 170 }}>Provisioning Type</Typography>
                <Select size="small" displayEmpty value={searchProvisioningType} onChange={e => setSearchProvisioningType(e.target.value)} sx={{ minWidth: 200 }}>
                    <MenuItem value=""><em>click to select</em></MenuItem>
                    {provisioningTypesData.map((pt: any) => <MenuItem key={pt.id} value={pt.id}>{pt.name}</MenuItem>)}
                </Select>
                <Typography sx={{ minWidth: 100 }}>Provider</Typography>
                <Select size="small" displayEmpty value={searchProvider} onChange={e => setSearchProvider(e.target.value)} sx={{ minWidth: 200 }}>
                    <MenuItem value=""><em>click to select</em></MenuItem>
                    {providers.map(p => <MenuItem key={p.providerId} value={p.providerId}>{p.providerName}</MenuItem>)}
                </Select>
                <Typography sx={{ minWidth: 50 }}>BP</Typography>
                <Select size="small" displayEmpty value={searchBp} onChange={e => setSearchBp(e.target.value)} sx={{ minWidth: 200 }}>
                    <MenuItem value=""><em>start typing for select</em></MenuItem>
                    {mockBps.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                </Select>
                <Button variant="contained" sx={{ ml: 2 }} onClick={handleSearchClick}>search</Button>
                <Button variant="outlined" color="error" sx={{ ml: 1 }}>delete with selected criteria</Button>
            </Box>
        </Paper>
    );
};

export default SearchCustomerRequestForm;
