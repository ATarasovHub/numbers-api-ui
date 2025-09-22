import React, { useMemo, useState } from 'react';
import {
    Box,
    Button,
    Paper,
    TextField,
    FormControlLabel,
    Checkbox,
    Typography,
    List,
    ListItem,
    ListSubheader,
    Stack,
    Chip,
    Divider,
    Alert,
    Snackbar,
    CircularProgress,
    Badge
} from '@mui/material';
import { paperStyle, subtitle1Style } from '../../../styles/ProviderAdminPageStyles';
import { countsBarStyle, listBoxStyle } from '../../../styles/AddNumbersBulkFormStyles';

interface AddNumbersBulkFormProps {
    selectedProviderId: string;
    selectedCountryId: string;
}

interface NumberDTO {
    numberId: number;
    number: string;
    numberProviderId: number;
    countryId: number;
    smsEnabled: boolean;
    voiceEnabled: boolean;
}

interface BulkNumbersResponseDTO {
    created: NumberDTO[];
    duplicatesInRequest: string[];
    invalidFormat: string[];
    alreadyExist: string[];
}

function normalizeNumber(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return '';
    let s = trimmed.replace(/[^\d+]/g, '');
    if (s.startsWith('00')) s = '+' + s.slice(2);
    if (!s.startsWith('+') && /^\d+$/.test(s)) s = '+' + s;
    return s;
}

function isValidE164(num: string): boolean {
    return /^\+[1-9]\d{6,14}$/.test(num);
}

function tokenize(text: string): string[] {
    return text.split(/[\s,;|\n\r\t]+/).map(t => t.trim()).filter(Boolean);
}

const AddNumbersBulkForm: React.FC<AddNumbersBulkFormProps> = ({ selectedProviderId, selectedCountryId }) => {
    const [numbersText, setNumbersText] = useState('');
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [postValidOnly, setPostValidOnly] = useState(true);
    const [loading, setLoading] = useState(false);
    const [snack, setSnack] = useState<{ open: boolean; severity: 'success' | 'error' | 'info'; msg: string }>({
        open: false,
        severity: 'info',
        msg: ''
    });

    const parsed = useMemo(() => {
        const raw = tokenize(numbersText);
        const normalized = raw.map(normalizeNumber).filter(Boolean);
        const seen = new Set<string>();
        const valid: string[] = [];
        const invalidFormat: string[] = [];
        const duplicatesInRequest: string[] = [];
        normalized.forEach(n => {
            if (!seen.has(n)) {
                seen.add(n);
                if (isValidE164(n)) valid.push(n);
                else invalidFormat.push(n);
            } else {
                duplicatesInRequest.push(n);
            }
        });
        const uniqueDuplicates = Array.from(new Set(duplicatesInRequest));
        const uniqueInvalid = Array.from(new Set(invalidFormat));
        return {
            total: raw.length,
            normalized,
            valid,
            invalidFormat: uniqueInvalid,
            duplicatesInRequest: uniqueDuplicates,
            toSend: postValidOnly ? valid : normalized
        };
    }, [numbersText, postValidOnly]);

    const canSubmit = Boolean(selectedProviderId) && Boolean(selectedCountryId) && parsed.toSend.length > 0;

    const handleSubmit = async () => {
        if (!selectedProviderId || !selectedCountryId) {
            setSnack({ open: true, severity: 'error', msg: 'Select provider and country first' });
            return;
        }
        if (parsed.toSend.length === 0) {
            setSnack({ open: true, severity: 'error', msg: 'No numbers to submit' });
            return;
        }
        setLoading(true);
        try {
            const url = `http://localhost:8080/provider/${selectedProviderId}/numbers-bulk?countryId=${encodeURIComponent(selectedCountryId)}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numbers: parsed.toSend,
                    smsEnabled,
                    voiceEnabled
                })
            });
            if (res.ok) {
                const data: BulkNumbersResponseDTO = await res.json();
                setSnack({ open: true, severity: 'success', msg: `Uploaded: ${data.created.length}` });
                if (postValidOnly) setNumbersText('');
            } else {
                const error = await res.text();
                setSnack({ open: true, severity: 'error', msg: error || 'Request failed' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={paperStyle}>
            <Typography sx={subtitle1Style}>Add Numbers (Bulk)</Typography>

            <TextField
                label="Numbers (comma, space or newline separated)"
                placeholder="+491761234567,+491761234568  +380501234567"
                multiline
                rows={5}
                fullWidth
                value={numbersText}
                onChange={(e) => setNumbersText(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={countsBarStyle}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Badge color="success" badgeContent={parsed.valid.length}>
                        <Chip label="Valid" color="success" />
                    </Badge>
                    <Badge color="warning" badgeContent={parsed.duplicatesInRequest.length}>
                        <Chip label="Duplicates" color="warning" variant="outlined" />
                    </Badge>
                    <Badge color="error" badgeContent={parsed.invalidFormat.length}>
                        <Chip label="Invalid" color="error" variant="outlined" />
                    </Badge>
                    <Chip label={`Total: ${parsed.total}`} />
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControlLabel
                        control={<Checkbox checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} />}
                        label="SMS Enabled"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={voiceEnabled} onChange={(e) => setVoiceEnabled(e.target.checked)} />}
                        label="Voice Enabled"
                    />
                </Stack>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction={{ xs: 'column', md: 'row' } as const} spacing={2}>
                <Box sx={listBoxStyle}>
                    <List dense subheader={<ListSubheader>Valid & Unique</ListSubheader>}>
                        {parsed.valid.length > 0 ? parsed.valid.slice(0, 100).map((n) => <ListItem key={`v-${n}`}>{n}</ListItem>) : <ListItem>Empty</ListItem>}
                    </List>
                </Box>
                <Box sx={listBoxStyle}>
                    <List dense subheader={<ListSubheader>Duplicates in Request</ListSubheader>}>
                        {parsed.duplicatesInRequest.length > 0 ? parsed.duplicatesInRequest.slice(0, 100).map((n) => <ListItem key={`d-${n}`}>{n}</ListItem>) : <ListItem>Empty</ListItem>}
                    </List>
                </Box>
                <Box sx={listBoxStyle}>
                    <List dense subheader={<ListSubheader>Invalid Format</ListSubheader>}>
                        {parsed.invalidFormat.length > 0 ? parsed.invalidFormat.slice(0, 100).map((n) => <ListItem key={`i-${n}`}>{n}</ListItem>) : <ListItem>Empty</ListItem>}
                    </List>
                </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={2} alignItems="center">
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!canSubmit || loading}
                    startIcon={loading ? <CircularProgress color="inherit" size={18} /> : undefined}
                >
                    {loading ? 'Uploading...' : `Upload Numbers (${parsed.toSend.length})`}
                </Button>
                <Button variant="outlined" onClick={() => setNumbersText('')}>
                    Clear
                </Button>
            </Stack>

            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default AddNumbersBulkForm;
