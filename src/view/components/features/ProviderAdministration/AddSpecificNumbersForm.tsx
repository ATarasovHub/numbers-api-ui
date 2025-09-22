import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Select, MenuItem, Button, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    paperStyle,
    subtitle1Style,
    flexAlignCenterGap1Mb1,
    width120,
    flexGap1
} from '../../../styles/ProviderAdminPageStyles';

interface Country {
    countryId: string;
    countryName: string;
}

interface AddSpecificNumbersFormProps {
    countries: Country[];
}

type SingleNumberRow = {
    id: string;
    number: string;
    countryId: string;
    serviceSms: boolean;
    serviceVoice: boolean;
};

const AddSpecificNumbersForm: React.FC<AddSpecificNumbersFormProps> = ({ countries }) => {
    const [singleNumbers, setSingleNumbers] = useState<SingleNumberRow[]>([]);
    const [isAddingSingles, setIsAddingSingles] = useState(false);

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
    );
};

export default AddSpecificNumbersForm;
