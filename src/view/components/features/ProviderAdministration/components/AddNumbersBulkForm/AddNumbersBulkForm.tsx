import React, { useState } from 'react';
import {
    Box,
    Paper,
    Divider,
    Snackbar,
    Alert,
} from '@mui/material';
import { useParsedNumbers } from '../../hooks/useParsedNumbers';
import { useAddNumbersBulkMutation } from '../../hooks/useAddNumbersBulkMutation';
import { NumberInputField } from './NumberInputField/NumberInputField';
import { StatsBar } from './StatsBar/StatsBar';
import { NumbersList } from './NumbersList/NumbersList';
import { SubmitControls } from './SubmitControls/SubmitControls';
import { paperStyle, subtitle1Style, countsBarStyle, listBoxStyle } from './AddNumbersBulkForm.styles';
import { BulkNumbersResponseDTO } from './AddNumbersBulkForm.types';

interface AddNumbersBulkFormProps {
    selectedProviderId: string;
    selectedCountryId: string;
}

export const AddNumbersBulkForm: React.FC<AddNumbersBulkFormProps> = ({ selectedProviderId, selectedCountryId }) => {
    const [numbersText, setNumbersText] = useState('');
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [postValidOnly, setPostValidOnly] = useState(true);
    const [snack, setSnack] = useState<{ open: boolean; severity: 'success' | 'error' | 'info'; msg: string }>({
        open: false,
        severity: 'info',
        msg: '',
    });

    const parsed = useParsedNumbers(numbersText, postValidOnly);
    const { mutate, loading } = useAddNumbersBulkMutation();

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

        try {
            const result = await mutate(selectedProviderId, selectedCountryId, parsed.toSend, smsEnabled, voiceEnabled, {
                onSuccess: (data: BulkNumbersResponseDTO) => {
                    setSnack({
                        open: true,
                        severity: 'success',
                        msg: `Uploaded: ${data.created.length}`,
                    });
                    if (postValidOnly) {
                        setNumbersText('');
                    }
                },
                onError: (error) => {
                    setSnack({
                        open: true,
                        severity: 'error',
                        msg: error.message,
                    });
                },
            });
        } catch (err) {
            // Error already handled in the mutation hook
        }
    };

    const handleClear = () => {
        setNumbersText('');
    };

    return (
        <Paper sx={paperStyle}>
            <Box sx={subtitle1Style}>Add Numbers (Bulk)</Box>

            <NumberInputField value={numbersText} onChange={setNumbersText} />

            <StatsBar
                validCount={parsed.valid.length}
                duplicateCount={parsed.duplicatesInRequest.length}
                invalidCount={parsed.invalidFormat.length}
                totalCount={parsed.total}
                onSmsChange={setSmsEnabled}
                onVoiceChange={setVoiceEnabled}
                smsEnabled={smsEnabled}
                voiceEnabled={voiceEnabled}
            />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={listBoxStyle}>
                    <NumbersList
                        title="Valid & Unique"
                        numbers={parsed.valid}
                        emptyText="Empty"
                    />
                </Box>
                <Box sx={listBoxStyle}>
                    <NumbersList
                        title="Duplicates in Request"
                        numbers={parsed.duplicatesInRequest}
                        emptyText="Empty"
                    />
                </Box>
                <Box sx={listBoxStyle}>
                    <NumbersList
                        title="Invalid Format"
                        numbers={parsed.invalidFormat}
                        emptyText="Empty"
                    />
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <SubmitControls
                onSubmit={handleSubmit}
                onClear={handleClear}
                disabled={!canSubmit}
                loading={loading}
                count={parsed.toSend.length}
            />

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