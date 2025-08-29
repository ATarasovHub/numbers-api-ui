import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Select, MenuItem, Button } from '@mui/material';

const mockBps = [
    { id: 'twilio', name: 'twilio' },
    { id: 'bp2', name: 'bp2' },
];

interface Provider {
    providerId: string;
    providerName: string;
}

interface CreateCustomerRequestFormProps {
    providers: Provider[];
    bps: typeof mockBps;
}

const CreateCustomerRequestForm: React.FC<CreateCustomerRequestFormProps> = ({ providers, bps }) => {
    const [requestedNumbers, setRequestedNumbers] = useState('');
    const [provider, setProvider] = useState('');
    const [bp, setBp] = useState('');
    const [comment, setComment] = useState('');
    const [requestDate, setRequestDate] = useState('2025-07-14');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                requestedNumbers: Number(requestedNumbers),
                providerId: provider,
                bp,
                comment,
                requestDate,
            };
            const res = await fetch('/customer-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed to create request');
            const data = await res.json();
            alert('Customer request created!\n' + JSON.stringify(data, null, 2));
            setRequestedNumbers('');
            setProvider('');
            setBp('');
            setComment('');
            setRequestDate('2025-07-14');
        } catch (e: any) {
            alert('Error: ' + (e.message || e));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Create New Customer Request</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ minWidth: 170 }}>Requested Numbers</Typography>
                    <TextField size="small" value={requestedNumbers} onChange={e => setRequestedNumbers(e.target.value)} sx={{ minWidth: 200 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ minWidth: 170 }}>Provider</Typography>
                    <Select size="small" displayEmpty value={provider} onChange={e => setProvider(e.target.value)} sx={{ minWidth: 200 }}>
                        <MenuItem value=""><em>click to select</em></MenuItem>
                        {providers.map(p => <MenuItem key={p.providerId} value={p.providerId}>{p.providerName}</MenuItem>)}
                    </Select>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ minWidth: 170 }}>BP</Typography>
                    <Select size="small" displayEmpty value={bp} onChange={e => setBp(e.target.value)} sx={{ minWidth: 200 }}>
                        <MenuItem value=""><em>start typing for select</em></MenuItem>
                        {bps.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                    </Select>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Typography sx={{ minWidth: 170, mt: 1 }}>Comment</Typography>
                    <TextField size="small" multiline minRows={4} value={comment} onChange={e => setComment(e.target.value)} sx={{ minWidth: 400 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ minWidth: 170 }}>Request Date</Typography>
                    <TextField size="small" type="date" value={requestDate} onChange={e => setRequestDate(e.target.value)} sx={{ minWidth: 200 }} />
                </Box>
                <Box>
                    <Button variant="contained" onClick={handleCreate} disabled={isSubmitting}>Create</Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default CreateCustomerRequestForm;
