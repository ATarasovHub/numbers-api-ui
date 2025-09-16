import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Select, MenuItem, Button, Checkbox, FormControlLabel } from '@mui/material';
import { paperStyle, subtitle1Style, flexAlignCenterGap1Mb1, width120, width60, flexGap1 } from '../styles/ProviderAdminPageStyles';

interface Country {
    countryId: string;
    countryName: string;
}

interface AddNumbersRangeFormProps {
    countries: Country[];
    providerId: string | number;
}

const NEW_COUNTRY_VALUE = '__NEW__';

const AddNumbersRangeForm: React.FC<AddNumbersRangeFormProps> = ({ countries, providerId }) => {
    const [fromNumber, setFromNumber] = useState('');
    const [toNumber, setToNumber] = useState('');
    const [rangeSize, setRangeSize] = useState('');
    const [addServiceSms, setAddServiceSms] = useState(false);
    const [addServiceVoice, setAddServiceVoice] = useState(false);
    const [addCountryId, setAddCountryId] = useState('');
    const [newCountryName, setNewCountryName] = useState('');
    const [isAddingNumbers, setIsAddingNumbers] = useState(false);
    const [lastEdited, setLastEdited] = useState<'from' | 'to' | 'size' | ''>('');

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
            const sizeN = Number(rangeSize);
            if (rangeSize && !isNaN(from) && !isNaN(sizeN) && sizeN > 0) {
                const nextTo = String(from + sizeN - 1);
                if (toNumber !== nextTo) setToNumber(nextTo);
            } else if (toNumber && !isNaN(from) && !isNaN(to)) {
                const nextSize = to - from + 1;
                const v = nextSize > 0 ? String(nextSize) : '';
                if (rangeSize !== v) setRangeSize(v);
            }
        }
    }, [fromNumber, toNumber, rangeSize, lastEdited]);

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
        const range = resolveRange();
        if (!range) {
            alert('Fill valid From+Size or From–To');
            return;
        }
        if (!providerId) {
            alert('Select provider');
            return;
        }
        if (!addCountryId) {
            alert('Select country');
            return;
        }
        if (addCountryId === NEW_COUNTRY_VALUE && !newCountryName.trim()) {
            alert('Enter new country name');
            return;
        }

        setIsAddingNumbers(true);
        try {
            const params = new URLSearchParams();
            params.set('fromNumber', String(range.from));
            params.set('toNumber', String(range.to));
            params.set('smsEnabled', String(addServiceSms));
            params.set('voiceEnabled', String(addServiceVoice));
            if (addCountryId !== NEW_COUNTRY_VALUE) {
                params.set('countryId', String(addCountryId).trim());
            } else {
                params.set('countryName', newCountryName.trim());
            }

            const url = `http://localhost:8080/provider/${providerId}/number-ranges`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || 'Request failed');
            }
            const created: string[] = await res.json();
            alert(`Numbers created: ${created.length}`);
            setFromNumber('');
            setToNumber('');
            setRangeSize('');
            setAddServiceSms(false);
            setAddServiceVoice(false);
            setAddCountryId('');
            setNewCountryName('');
        } catch (e: any) {
            alert(e.message || 'Failed to add numbers');
        } finally {
            setIsAddingNumbers(false);
        }
    };

    return (
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
                    sx={{ minWidth: 180 }}
                    value={addCountryId}
                    onChange={e => setAddCountryId(String(e.target.value))}
                    MenuProps={{ PaperProps: { style: { maxHeight: 250, width: 240 } } }}
                >
                    <MenuItem value=""><em>click to select</em></MenuItem>
                    {countries.map(c => (
                        <MenuItem key={c.countryId} value={c.countryId}>{c.countryName}</MenuItem>
                    ))}
                    <MenuItem value={NEW_COUNTRY_VALUE}>+ New country…</MenuItem>
                </Select>
                {addCountryId === NEW_COUNTRY_VALUE && (
                    <TextField
                        size="small"
                        placeholder="Country name"
                        value={newCountryName}
                        onChange={e => setNewCountryName(e.target.value)}
                        sx={{ minWidth: 220, ml: 1 }}
                    />
                )}
                <Typography>Service</Typography>
                <FormControlLabel control={<Checkbox checked={addServiceSms} onChange={e => setAddServiceSms(e.target.checked)} />} label="SMS" />
                <FormControlLabel control={<Checkbox checked={addServiceVoice} onChange={e => setAddServiceVoice(e.target.checked)} />} label="Voice" />
            </Box>
            <Box sx={flexGap1}>
                <Button variant="contained" size="small" onClick={handleAddNumbers} disabled={isAddingNumbers || !providerId}>Save (add numbers)</Button>
            </Box>
        </Paper>
    );
};

export default AddNumbersRangeForm;
