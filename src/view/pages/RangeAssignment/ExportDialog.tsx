import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, LinearProgress, Alert } from '@mui/material';

interface ExportDialogProps {
    open: boolean;
    loading: boolean;
    progress: number;
    onClose: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ open, loading, progress, onClose }) => {
    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Preparing Excel Export</DialogTitle>
            <DialogContent>
                <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Loading all data for export...
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        {progress}%
                    </Typography>
                    {progress === 100 && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Data loaded successfully! Generating Excel file...
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportDialog;
