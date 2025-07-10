import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Select, MenuItem, Button, Checkbox, FormControlLabel, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import providersData from '../mocks/data/providers';
import provisioningTypesData from '../mocks/data/provisioningTypes';
import countriesData from '../mocks/data/countries';
import connectionTypesData from '../mocks/data/connectionTypes';
import numberTypesData from '../mocks/data/numberTypes';
import providerDetailsData from '../mocks/data/providerDetails';

const providerDetailsTyped: { [key: string]: any } = providerDetailsData;

function fakeApi<T>(data: T, delay = 300): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
}

const ProviderAdminPage: React.FC = () => {
    const [providers, setProviders] = useState<{ numberProviderId: string; numberProviderName: string }[]>([]);
    const [selectedProviderId, setSelectedProviderId] = useState<string>('');
    const [providerDetails, setProviderDetails] = useState<any>(null);
    const [provisioningTypes, setProvisioningTypes] = useState<{ id: string; name: string }[]>([]);
    const [countries, setCountries] = useState<{ countryId: string; countryName: string }[]>([]);
    const [connectionTypes, setConnectionTypes] = useState<{ id: string; name: string }[]>([]);
    const [numberTypes, setNumberTypes] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        fakeApi(providersData).then((data) => setProviders(data));
        fakeApi(provisioningTypesData).then((data) => setProvisioningTypes(data));
        fakeApi(countriesData).then((data) => setCountries(data));
        fakeApi(connectionTypesData).then((data) => setConnectionTypes(data));
        fakeApi(numberTypesData).then((data) => setNumberTypes(data));
    }, []);

    useEffect(() => {
        if (selectedProviderId) {
            fakeApi(providerDetailsTyped[selectedProviderId] || null).then((data) => setProviderDetails(data));
        } else {
            setProviderDetails(null);
        }
    }, [selectedProviderId]);

    const handleProviderDetailChange = (field: string, value: any) => {
        setProviderDetails((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        alert('Сохранено!\n' + JSON.stringify(providerDetails, null, 2));
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'gray' }}>
                <span style={{fontSize: '1rem', color: '#888'}}>Administration &gt; Provider Administration</span>
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Provider Administration</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography sx={{ minWidth: 70 }}>Provider</Typography>
                    <Select size="small" displayEmpty sx={{ minWidth: 200 }} value={selectedProviderId} onChange={e => setSelectedProviderId(e.target.value)}>
                        <MenuItem value=""><em>click to select</em></MenuItem>
                        {providers.map((p: any) => (
                            <MenuItem key={p.numberProviderId} value={p.numberProviderId}>{p.numberProviderName}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Provider (Edit / Create)</Typography>
                <Box display="grid" gridTemplateColumns="180px 1fr" gap={1} alignItems="center">
                    <Typography>Provider Name</Typography>
                    <TextField size="small" fullWidth value={providerDetails?.providerName || ''} onChange={e => handleProviderDetailChange('providerName', e.target.value)} />
                    <Typography>Stocklimit Warning</Typography>
                    <TextField size="small" fullWidth value={providerDetails?.stockLimitWarning || ''} onChange={e => handleProviderDetailChange('stockLimitWarning', e.target.value)} />
                    <Typography>Thresholdlimit Warning</Typography>
                    <TextField size="small" fullWidth value={providerDetails?.thresholdLimitWarning || ''} onChange={e => handleProviderDetailChange('thresholdLimitWarning', e.target.value)} />
                    <Typography>Provisioning Type</Typography>
                    <Select size="small" displayEmpty fullWidth value={providerDetails?.provisioningTypeId || ''} onChange={e => handleProviderDetailChange('provisioningTypeId', e.target.value)}>
                        <MenuItem value=""><em>start typing for select</em></MenuItem>
                        {provisioningTypes.map((t: any) => (
                            <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                        ))}
                    </Select>
                    <Typography>Country</Typography>
                    <Select size="small" displayEmpty fullWidth value={providerDetails?.countryId || ''} onChange={e => handleProviderDetailChange('countryId', e.target.value)}>
                        <MenuItem value=""><em>start typing for select</em></MenuItem>
                        {countries.map((c: any) => (
                            <MenuItem key={c.countryId} value={c.countryId}>{c.countryName}</MenuItem>
                        ))}
                    </Select>
                    <Typography>Connection Types</Typography>
                    <Select size="small" displayEmpty fullWidth value={providerDetails?.connectionTypeId || ''} onChange={e => handleProviderDetailChange('connectionTypeId', e.target.value)}>
                        <MenuItem value=""><em>click to select</em></MenuItem>
                        {connectionTypes.map((ct: any) => (
                            <MenuItem key={ct.id} value={ct.id}>{ct.name}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Add Number(s) <span style={{fontWeight:400, fontSize:'0.95em'}}>(just leave it empty if you only want to edit/create a provider)</span></Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography>From Number</Typography>
                    <TextField size="small" sx={{ width: 120 }} />
                    <Typography>To Number</Typography>
                    <TextField size="small" sx={{ width: 120 }} />
                    <Typography>Size</Typography>
                    <TextField size="small" sx={{ width: 60 }} value={0} />
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography>Numbertype</Typography>
                    <Select size="small" displayEmpty sx={{ minWidth: 150 }}>
                        <MenuItem value=""><em>click to select</em></MenuItem>
                        {numberTypes.map((nt: any) => (
                            <MenuItem key={nt.id} value={nt.id}>{nt.name}</MenuItem>
                        ))}
                    </Select>
                    <Typography>Service</Typography>
                    <FormControlLabel control={<Checkbox />} label="SMS" />
                    <FormControlLabel control={<Checkbox />} label="Voice" />
                </Box>
                <Box display="flex" gap={1}>
                    <Button variant="contained" size="small" onClick={handleSave}>Save (update/create)</Button>
                    <Button variant="outlined" size="small">Show Platinum Numbers</Button>
                </Box>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Guessed Platinum Numbers!</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Platinum Number</TableCell>
                            <TableCell>Reason why platinum</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                       
                    </TableBody>
                </Table>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Current Ranges</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>From Number</TableCell>
                            <TableCell>To Number</TableCell>
                            <TableCell>Entries</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                       {providerDetails?.countryStats?.map((cs: any) => (
                            <TableRow key={cs.countryId}>
                                <TableCell>{cs.countryCode}</TableCell>
                                <TableCell>{cs.countryName}</TableCell>
                                <TableCell>{cs.totalNumbers}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default ProviderAdminPage; 