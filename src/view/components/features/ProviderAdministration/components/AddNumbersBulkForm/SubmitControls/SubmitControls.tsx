import React from 'react';
import {
    Button,
    CircularProgress,
    Stack,
} from '@mui/material';

interface SubmitControlsProps {
    onSubmit: () => void;
    onClear: () => void;
    disabled: boolean;
    loading: boolean;
    count: number;
}

export const SubmitControls: React.FC<SubmitControlsProps> = ({
                                                                  onSubmit,
                                                                  onClear,
                                                                  disabled,
                                                                  loading,
                                                                  count,
                                                              }) => {
    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <Button
                variant="contained"
                onClick={onSubmit}
                disabled={disabled || loading}
                startIcon={loading ? <CircularProgress color="inherit" size={18} /> : undefined}
            >
                {loading ? 'Uploading...' : `Upload Numbers (${count})`}
            </Button>
            <Button variant="outlined" onClick={onClear}>
                Clear
            </Button>
        </Stack>
    );
};