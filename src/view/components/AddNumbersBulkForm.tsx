import React, { useState } from 'react';
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
} from '@mui/material';
import { paperStyle, subtitle1Style, flexGap1 } from '../styles/ProviderAdminPageStyles';

interface AddNumbersBulkFormProps {
    selectedProviderId: string;
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

const AddNumbersBulkForm: React.FC<AddNumbersBulkFormProps> = ({ selectedProviderId }) => {
    const [numbersText, setNumbersText] = useState('');
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<BulkNumbersResponseDTO | null>(null);

    const handleSubmit = async () => {
        if (!selectedProviderId) {
            alert('Please select provider first');
            return;
        }

        const numbers = numbersText
            .split(/[\s,;\n]+/)
            .map((n) => n.trim())
            .filter((n) => n.length > 0);

        if (numbers.length === 0) {
            alert('Please enter at least one number');
            return;
        }

        setLoading(true);
        setResponse(null);
        try {
            const res = await fetch(`http://localhost:8080/provider/${selectedProviderId}/numbers-bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numbers,
                    smsEnabled,
                    voiceEnabled,
                }),
            });

            if (res.ok) {
                const data: BulkNumbersResponseDTO = await res.json();
                setResponse(data);
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
                onChange={(e) => {
                    setNumbersText(e.target.value);
                    setResponse(null);
                }}
                sx={{ mb: 2 }}
            />

            <Box sx={flexGap1}>
                <FormControlLabel
                    control={<Checkbox checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} />}
                    label="SMS Enabled"
                />
                <FormControlLabel
                    control={<Checkbox checked={voiceEnabled} onChange={(e) => setVoiceEnabled(e.target.checked)} />}
                    label="Voice Enabled"
                />
            </Box>

            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Numbers'}
            </Button>

            {response && (
                <Box mt={3}>
                    <List subheader={<ListSubheader>Successfully Created Numbers</ListSubheader>}>
                        {response.created.length > 0 ? (
                            response.created.map((num) => <ListItem key={num.numberId}>{num.number}</ListItem>)
                        ) : (
                            <ListItem>No numbers created</ListItem>
                        )}
                    </List>

                    <List subheader={<ListSubheader>Duplicates in Request</ListSubheader>}>
                        {response.duplicatesInRequest.length > 0 ? (
                            response.duplicatesInRequest.map((num, idx) => <ListItem key={idx}>{num}</ListItem>)
                        ) : (
                            <ListItem>No duplicates found</ListItem>
                        )}
                    </List>

                    <List subheader={<ListSubheader>Invalid Format</ListSubheader>}>
                        {response.invalidFormat.length > 0 ? (
                            response.invalidFormat.map((num, idx) => <ListItem key={idx}>{num}</ListItem>)
                        ) : (
                            <ListItem>No invalid formats</ListItem>
                        )}
                    </List>

                    <List subheader={<ListSubheader>Already Exist</ListSubheader>}>
                        {response.alreadyExist.length > 0 ? (
                            response.alreadyExist.map((num, idx) => <ListItem key={idx}>{num}</ListItem>)
                        ) : (
                            <ListItem>No existing numbers</ListItem>
                        )}
                    </List>
                </Box>
            )}
        </Paper>
    );
};

export default AddNumbersBulkForm;
