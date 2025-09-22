import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    LinearProgress,
    Alert,
} from '@mui/material';
import { styles } from './ExportDialog.styles';

interface ExportDialogProps {
    open: boolean;
    loading: boolean;
    progress: number;
    onClose: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
                                                       open,
                                                       loading,
                                                       progress,
                                                       onClose,
                                                   }) => {
    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Preparing Excel Export</DialogTitle>
            <DialogContent>
                <Box sx={styles.progressContainer}>
                    <Typography variant="body2" sx={styles.progressText}>
                        Loading all data for export...
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="body2" sx={styles.percentText}>
                        {progress}%
                    </Typography>
                    {progress === 100 && (
                        <Alert severity="success" sx={styles.successAlert}>
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