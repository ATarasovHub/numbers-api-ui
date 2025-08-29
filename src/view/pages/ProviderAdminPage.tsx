import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Select, MenuItem, Button, Checkbox, FormControlLabel, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import provisioningTypesData from '../../mocks/data/provisioningTypes';
import countriesData from '../../mocks/data/countries';
import connectionTypesData from '../../mocks/data/connectionTypes';
import numberTypesData from '../../mocks/data/numberTypes';
import providerDetailsData from '../../mocks/data/providerDetails';
import {
    boxStyle,
    subtitle2Style,
    subtitle1Style,
    paperStyle,
    gridStyle,
    flexAlignCenterGap1,
    flexAlignCenterGap1Mb1,
    minWidth200,
    width120,
    width60,
    flexGap1,
    tableSubtitle2,
    paperNoMargin
} from '../styles/ProviderAdminPageStyles';

const providerDetailsTyped: { [key: string]: any } = providerDetailsData;

function fakeApi<T>(data: T, delay = 300): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
}

type SingleNumberRow = {
    id: string;
    number: string;
    countryId: string;
    serviceSms: boolean;
    serviceVoice: boolean;
};

const ProviderAdminPage: React.FC = () => {
    const [providers, setProviders] = useState<{ numberProviderId: string; numberProviderName: string }[]>([]);
    const [selectedProviderId, setSelectedProviderId] = useState<string>('');
    const [providerDetails, setProviderDetails] = useState<any>(null);
    const [provisioningTypes, setProvisioningTypes] = useState<{ id: string; name: string }[]>([]);
    const [countries, setCountries] = useState<{ countryId: string; countryName: string }[]>([]);
    const [connectionTypes, setConnectionTypes] = useState<{ id: string; name: string }[]>([]);

    const [fromNumber, setFromNumber] = useState('');
    const [toNumber, setToNumber] = useState('');
    const [rangeSize, setRangeSize] = useState('');
    const [addServiceSms, setAddServiceSms] = useState(false);
    const [addServiceVoice, setAddServiceVoice] = useState(false);
    const [addCountryId, setAddCountryId] = useState('');
    const [isAddingNumbers, setIsAddingNumbers] = useState(false);

    const [singleNumbers, setSingleNumbers] = useState<SingleNumberRow[]>([]);
    const [isAddingSingles, setIsAddingSingles] = useState(false);

    const [lastEdited, setLastEdited] = useState<'from' | 'to' | 'size' | ''>('');

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

    useEffect(() => {
        const from = Number(fromNumber);
        const to = Number(toNumber);
        const size = Number(rangeSize);
        if (lastEdited === 'size') {
            if (fromNumber && rangeSize && !isNaN(from) && !isNaN(size) && size > 0) {
                const nextTo = String(from + size - 1);
                if (toNumber !== nextTo) setToNumber(nextTo);
            }
            return;
        }
        if (lastEdited === 'to') {
            if (fromNumber && toNumber && !isNaN(from) && !isNaN(to)) {
                const nextSize = to - from + 1;
                const v = nextSize > 0 ? String(nextSize) : '';
                if (rangeSize !== v) setRangeSize(v);
            }
            return;
        }
        if (lastEdited === 'from') {
            if (rangeSize && !isNaN(from) && !isNaN(size) && size > 0) {
                const nextTo = String(from + size - 1);
                if (toNumber !== nextTo) setToNumber(nextTo);
            } else if (toNumber && !isNaN(from) && !isNaN(to)) {
                const nextSize = to - from + 1;
                const v = nextSize > 0 ? String(nextSize) : '';
                if (rangeSize !== v) setRangeSize(v);
            }
        }
    }, [fromNumber, toNumber, rangeSize, lastEdited]);

    const handleProviderDetailChange = (field: string, value: any) => {
        setProviderDetails((prev: any) => ({ ...prev, [field]: value }));
    };

    const resolveRange = () => {
        const from = Number(fromNumber);
        const size = Number(rangeSize);
        if (fromNumber && rangeSize && !isNaN(from) && !isNaN(size) && size > 0) {
            return { from, to: from + size - 1 };
        }
        const to = Number(toNumber);
        if (fromNumber && toNumber && !isNaN(from) && !isNaN(to) && from <= to) {
            return { from, to };
        }
        return null;
    };

    const handleAddNumbers = async () => {
        if (!addCountryId) {
            alert('Select country');
            return;
        }
        const range = resolveRange();
        if (!range) {
            alert('Fill valid From+Size or From–To');
            return;
        }
        setIsAddingNumbers(true);
        const numbers = [];
        for (let n = range.from; n <= range.to; n++) {
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
            setRangeSize('');
            setAddServiceSms(false);
            setAddServiceVoice(false);
            setAddCountryId('');
        } catch (e) {
            alert('Failed to add numbers');
        } finally {
            setIsAddingNumbers(false);
        }
    };

    const addSingleRow = () => {
        const id = String(Date.now()) + Math.random().toString(36).slice(2);
        setSingleNumbers(prev => [...prev, { id, number: '', countryId: '', serviceSms: false, serviceVoice: false }]);
    };

    const removeSingleRow = (id: string) => {
        setSingleNumbers(prev => prev.filter(r => r.id !== id));
    };

    const updateSingleRow = (id: string, field: keyof SingleNumberRow, value: any) => {
        setSingleNumbers(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleSaveSingleNumbers = async () => {
        if (singleNumbers.length === 0) {
            alert('Nothing to save');
            return;
        }
        const invalid = singleNumbers.find(r => !r.number || isNaN(Number(r.number)) || !r.countryId);
        if (invalid) {
            alert('Fill number and country for each row');
            return;
        }
        setIsAddingSingles(true);
        const payload = singleNumbers.map(r => ({
            number: Number(r.number),
            countryId: Number(r.countryId),
            serviceSms: r.serviceSms,
            serviceVoice: r.serviceVoice
        }));
        try {
            await fetch('/numbers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            alert('Selected numbers added!');
            setSingleNumbers([]);
        } catch (e) {
            alert('Failed to add selected numbers');
        } finally {
            setIsAddingSingles(false);
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
                <Typography variant="subtitle1" sx={subtitle1Style}>Add Number(s) <span style={{fontWeight:400, fontSize:'0.95em'}}>(range)</span></Typography>
                <Box sx={flexAlignCenterGap1Mb1}>
                    <Typography>From Number</Typography>
                    <TextField size="small" sx={width120} value={fromNumber} onChange={e => { setFromNumber(e.target.value); setLastEdited('from'); }} />
                    <Typography>To Number</Typography>
                    <TextField size="small" sx={width120} value={toNumber} onChange={e => { setToNumber(e.target.value); setLastEdited('to'); }} />
                    <Typography>Size</Typography>
                    <TextField size="small" sx={width60} value={rangeSize} onChange={e => { setRangeSize(e.target.value); setLastEdited('size'); }} />
                </Box>
                <Box sx={flexAlignCenterGap1Mb1}>
                    <Typography>Country</Typography>
                    <Select
                        size="small"
                        displayEmpty
                        sx={{ minWidth: 120 }}
                        value={addCountryId}
                        onChange={e => setAddCountryId(e.target.value)}
                        MenuProps={{ PaperProps: { style: { maxHeight: 250, width: 200 } } }}
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

            <Paper variant="outlined" sx={paperStyle}>
                <Typography variant="subtitle1" sx={subtitle1Style}>Add Specific Number(s)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                    <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addSingleRow}>Add row</Button>
                    <Typography sx={{ color: '#888' }}>{singleNumbers.length} row(s)</Typography>
                </Box>
                {singleNumbers.map(row => (
                    <Box key={row.id} sx={flexAlignCenterGap1Mb1}>
                        <Typography>Number</Typography>
                        <TextField size="small" sx={width120} value={row.number} onChange={e => updateSingleRow(row.id, 'number', e.target.value)} />
                        <Typography>Country</Typography>
                        <Select
                            size="small"
                            displayEmpty
                            sx={{ minWidth: 160 }}
                            value={row.countryId}
                            onChange={e => updateSingleRow(row.id, 'countryId', e.target.value)}
                            MenuProps={{ PaperProps: { style: { maxHeight: 250, width: 220 } } }}
                        >
                            <MenuItem value=""><em>click to select</em></MenuItem>
                            {countries.map((c: any) => (
                                <MenuItem key={c.countryId} value={c.countryId}>{c.countryName}</MenuItem>
                            ))}
                        </Select>
                        <Typography>Service</Typography>
                        <FormControlLabel control={<Checkbox checked={row.serviceSms} onChange={e => updateSingleRow(row.id, 'serviceSms', e.target.checked)} />} label="SMS" />
                        <FormControlLabel control={<Checkbox checked={row.serviceVoice} onChange={e => updateSingleRow(row.id, 'serviceVoice', e.target.checked)} />} label="Voice" />
                        <IconButton aria-label="remove" color="error" onClick={() => removeSingleRow(row.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}
                <Box sx={flexGap1}>
                    <Button variant="contained" size="small" onClick={handleSaveSingleNumbers} disabled={isAddingSingles || singleNumbers.length === 0}>Save (add selected numbers)</Button>
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
