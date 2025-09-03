import React, {useState} from 'react';
import {Box, Button, Paper, TextField, FormControlLabel, Checkbox, Typography} from '@mui/material';
import {paperStyle, subtitle1Style, flexGap1} from '../styles/ProviderAdminPageStyles';

interface AddNumbersBulkFormProps {
    selectedProviderId: string;
}

const AddNumbersBulkForm: React.FC<AddNumbersBulkFormProps> = ({selectedProviderId}) => {
    const [numbersText, setNumbersText] = useState('');
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!selectedProviderId) {
            alert('Please select provider first');
            return;
        }

        const numbers = numbersText
            .split(/[\s,;\n]+/)
            .map(n => n.trim())
            .filter(n => n.length > 0);

        if (numbers.length === 0) {
            alert('Please enter at least one number');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/provider/${selectedProviderId}/numbers-bulk`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    numbers,
                    smsEnabled,
                    voiceEnabled
                }),
            });
            if (res.ok) {
                const data = await res.json();
                alert(`Successfully uploaded ${data.length} numbers`);
                setNumbersText('');
            } else {
                const error = await res.text();
                alert(`Error: ${error}`);
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
                multiline
                rows={4}
                fullWidth
                value={numbersText}
                onChange={(e) => setNumbersText(e.target.value)}
                sx={{mb: 2}}
            />

            <Box sx={flexGap1}>
                <FormControlLabel
                    control={<Checkbox checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)}/>}
                    label="SMS Enabled"
                />
                <FormControlLabel
                    control={<Checkbox checked={voiceEnabled} onChange={(e) => setVoiceEnabled(e.target.checked)}/>}
                    label="Voice Enabled"
                />
            </Box>

            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'Uploading...' : 'Upload Numbers'}
            </Button>
        </Paper>
    );
};

export default AddNumbersBulkForm;