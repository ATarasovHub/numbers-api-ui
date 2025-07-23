import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Select, MenuItem, Button, Checkbox, FormControlLabel, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import provisioningTypesData from '../mocks/data/provisioningTypes';
import countriesData from '../mocks/data/countries';
import connectionTypesData from '../mocks/data/connectionTypes';
import numberTypesData from '../mocks/data/numberTypes';
import providerDetailsData from '../mocks/data/providerDetails';
import {
    boxStyle,
    subtitle2Style,
    subtitle1Style,
    paperStyle,
    gridStyle,
    flexAlignCenterGap1,
    flexAlignCenterGap1Mb1,
    minWidth200,
    minWidth150,
    width120,
    width60,
    flexGap1,
    tableSubtitle2,
    tableNoNumbers,
    paperNoMargin
} from './styles/ProviderAdminPageStyles';

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

    const [fromNumber, setFromNumber] = useState('');
    const [toNumber, setToNumber] = useState('');
    const [addServiceSms, setAddServiceSms] = useState(false);
    const [addServiceVoice, setAddServiceVoice] = useState(false);
    const [addCountryId, setAddCountryId] = useState('');
    const [isAddingNumbers, setIsAddingNumbers] = useState(false);

    useEffect(() => {
        fetch('/provider')
            .then(res => res.json())
            .then(data => {
                setProviders(
                    data.map((p: any) => ({
                        numberProviderId: p.providerId,
                        numberProviderName: p.providerName
                    }))
                );
            });
        fakeApi(provisioningTypesData).then((data) => setProvisioningTypes(data));
        fetch('/countries')
            .then(res => res.json())
            .then(data => setCountries(
                data.map((c: any) => ({ countryId: String(c.countryId), countryName: c.countryName }))
            ));
        fakeApi(connectionTypesData).then((data) => setConnectionTypes(data));
    }, []);

    useEffect(() => {
        if (selectedProviderId) {
            fetch(`/provider/${selectedProviderId}`)
                .then(res => res.json())
                .then(data => setProviderDetails(data));
        } else {
            setProviderDetails(null);
        }
    }, [selectedProviderId]);

    const handleProviderDetailChange = (field: string, value: any) => {
        setProviderDetails((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleAddNumbers = async () => {
        if (!fromNumber || !toNumber || !addCountryId) {
            alert('Please fill all fields for number range!');
            return;
        }
        const from = Number(fromNumber);
        const to = Number(toNumber);
        if (isNaN(from) || isNaN(to) || from > to) {
            alert('Invalid number range!');
            return;
        }
        setIsAddingNumbers(true);
        const numbers = [];
        for (let n = from; n <= to; n++) {
            numbers.push({
                number: n,
                countryId: Number(addCountryId),
                serviceSms: addServiceSms,
                serviceVoice: addServiceVoice
            });
        }
        try {
            await fetch('/numbers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(numbers)
            });
            alert('Numbers added!');
            setFromNumber('');
            setToNumber('');
            setAddServiceSms(false);
            setAddServiceVoice(false);
            setAddCountryId('');
        } catch (e) {
            alert('Failed to add numbers');
        } finally {
            setIsAddingNumbers(false);
        }
    };

    return (
        <Box sx={boxStyle}>
            <Typography variant="subtitle2" sx={subtitle2Style}>
                <span style={{fontSize: '1rem', color: '#888'}}>Administration &gt; Provider Administration</span>
            </Typography>
            <Paper variant="outlined" sx={paperStyle}>
                <Typography variant="subtitle1" sx={subtitle1Style}>Provider Administration</Typography>
                <Box sx={flexAlignCenterGap1}>
                    <Typography sx={{ minWidth: 70 }}>Provider</Typography>
                    <Select size="small" displayEmpty sx={minWidth200} value={selectedProviderId} onChange={e => setSelectedProviderId(e.target.value)}>
                        <MenuItem value=""><em>click to select</em></MenuItem>
                        {providers.map((p: any) => (
                            <MenuItem key={p.numberProviderId} value={p.numberProviderId}>{p.numberProviderName}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Paper>
            <Paper variant="outlined" sx={paperStyle}>
                <Typography variant="subtitle1" sx={subtitle1Style}>Provider (Edit / Create)</Typography>
                <Box sx={gridStyle}>
                    <Typography>Provider ID</Typography>
                    <TextField size="small" fullWidth value={providerDetails?.providerId || ''} InputProps={{ readOnly: true }} />
                    <Typography>Provider Name</Typography>
                    <TextField size="small" fullWidth value={providerDetails?.providerName || ''} onChange={e => handleProviderDetailChange('providerName', e.target.value)} />
                    <Typography>Deleted At</Typography>
                    <TextField size="small" fullWidth value={providerDetails?.deletedAt || ''} InputProps={{ readOnly: true }} />
                    <Typography>Total Countries</Typography>
                    <TextField size="small" fullWidth value={providerDetails?.totalCountries || 0} onChange={e => handleProviderDetailChange('totalCountries', e.target.value)} />
                    <Typography>Total Numbers</Typography>
                    <TextField size="small" fullWidth value={providerDetails?.totalNumbers || 0} onChange={e => handleProviderDetailChange('totalNumbers', e.target.value)} />
                    <Typography>Total Assigned Numbers</Typography>
                    <TextField size="small" fullWidth value={providerDetails?.totalAssignedNumbers || 0} onChange={e => handleProviderDetailChange('totalAssignedNumbers', e.target.value)} />
                    <Typography>Total Monthly Cost</Typography>
                    <TextField size="small" fullWidth value={providerDetails?.totalMonthlyCost || 0} onChange={e => handleProviderDetailChange('totalMonthlyCost', e.target.value)} />
                </Box>
            </Paper>
            <Paper variant="outlined" sx={paperStyle}>
                <Typography variant="subtitle1" sx={subtitle1Style}>Add Number(s) <span style={{fontWeight:400, fontSize:'0.95em'}}>(just leave it empty if you only want to edit/create a provider)</span></Typography>
                <Box sx={flexAlignCenterGap1Mb1}>
                    <Typography>From Number</Typography>
                    <TextField size="small" sx={width120} value={fromNumber} onChange={e => setFromNumber(e.target.value)} />
                    <Typography>To Number</Typography>
                    <TextField size="small" sx={width120} value={toNumber} onChange={e => setToNumber(e.target.value)} />
                    <Typography>Size</Typography>
                    <TextField size="small" sx={width60} value={fromNumber && toNumber ? Math.max(0, Number(toNumber) - Number(fromNumber) + 1) : 0} disabled />
                </Box>
                <Box sx={flexAlignCenterGap1Mb1}>
                    <Typography>Country</Typography>
                    <Select
                        size="small"
                        displayEmpty
                        sx={{ minWidth: 120 }}
                        value={addCountryId}
                        onChange={e => setAddCountryId(e.target.value)}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 250,
                                    width: 200
                                }
                            }
                        }}
                    >
                        <MenuItem value=""><em>click to select</em></MenuItem>
                        {countries.map((c: any) => (
                            <MenuItem key={c.countryId} value={c.countryId}>{c.countryName}</MenuItem>
                        ))}
                    </Select>
                    <Typography>Service</Typography>
                    <FormControlLabel control={<Checkbox checked={addServiceSms} onChange={e => setAddServiceSms(e.target.checked)} />} label="SMS" />
                    <FormControlLabel control={<Checkbox checked={addServiceVoice} onChange={e => setAddServiceVoice(e.target.checked)} />} label="Voice" />
                </Box>
                <Box sx={flexGap1}>
                    <Button variant="contained" size="small" onClick={handleAddNumbers} disabled={isAddingNumbers}>Save (add numbers)</Button>
                </Box>
            </Paper>
            <Paper variant="outlined" sx={paperNoMargin}>
                <Typography variant="subtitle1" sx={subtitle1Style}>Current Ranges</Typography>
                {selectedProviderId && (
                    <Typography variant="subtitle2" sx={tableSubtitle2}>
                        Provider: {providers.find(p => p.numberProviderId === selectedProviderId)?.numberProviderName || '—'}
                    </Typography>
                )}
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Country Id</TableCell>
                            <TableCell>Country Name</TableCell>
                            <TableCell>Country Code</TableCell>
                            <TableCell>Total Numbers</TableCell>
                            <TableCell>Assigned Numbers</TableCell>
                            <TableCell>Monthly Cost</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {providerDetails?.countryStats?.map((cs: any) => (
                            <TableRow key={cs.countryId}>
                                <TableCell>{cs.countryId}</TableCell>
                                <TableCell>{cs.countryName}</TableCell>
                                <TableCell>{cs.countryCode}</TableCell>
                                <TableCell>{cs.totalNumbers}</TableCell>
                                <TableCell>{cs.assignedNumbers}</TableCell>
                                <TableCell>{cs.totalMonthlyCost}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default ProviderAdminPage;
