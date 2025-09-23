import React from 'react';
import {
    Stack,
    Chip,
    Badge,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

interface StatsBarProps {
    validCount: number;
    duplicateCount: number;
    invalidCount: number;
    totalCount: number;
    onSmsChange: (checked: boolean) => void;
    onVoiceChange: (checked: boolean) => void;
    smsEnabled: boolean;
    voiceEnabled: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({
                                                      validCount,
                                                      duplicateCount,
                                                      invalidCount,
                                                      totalCount,
                                                      onSmsChange,
                                                      onVoiceChange,
                                                      smsEnabled,
                                                      voiceEnabled,
                                                  }) => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Badge color="success" badgeContent={validCount}>
                    <Chip label="Valid" color="success" />
                </Badge>
                <Badge color="warning" badgeContent={duplicateCount}>
                    <Chip label="Duplicates" color="warning" variant="outlined" />
                </Badge>
                <Badge color="error" badgeContent={invalidCount}>
                    <Chip label="Invalid" color="error" variant="outlined" />
                </Badge>
                <Chip label={`Total: ${totalCount}`} />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
                <FormControlLabel
                    control={<Checkbox checked={smsEnabled} onChange={(e) => onSmsChange(e.target.checked)} />}
                    label="SMS Enabled"
                />
                <FormControlLabel
                    control={<Checkbox checked={voiceEnabled} onChange={(e) => onVoiceChange(e.target.checked)} />}
                    label="Voice Enabled"
                />
            </Stack>
        </Stack>
    );
};