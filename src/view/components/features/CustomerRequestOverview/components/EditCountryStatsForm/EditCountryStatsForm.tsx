import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useEditCountryStats } from '../../hooks/useEditCountryStats';
import { EditCountryStatsFormProps } from './EditCountryStatsForm.types';
import { editCountryStatsFormStyles } from './EditCountryStatsForm.styles';

const EditCountryStatsForm: React.FC<EditCountryStatsFormProps> = ({
                                                                       open,
                                                                       onClose,
                                                                       countryStat,
                                                                       onSave
                                                                   }) => {
    const {
        editData,
        isSaving,
        handleEditChange,
        handleSave
    } = useEditCountryStats(countryStat);

    if (!countryStat) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={editCountryStatsFormStyles.modalBox}>
                <Typography variant="h6" sx={editCountryStatsFormStyles.title}>
                    Edit Country Statistics
                </Typography>
                <TextField
                    label="Country Name"
                    name="countryName"
                    value={editData.countryName || ''}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Country Code"
                    name="countryCode"
                    value={editData.countryCode || ''}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Total Numbers"
                    name="totalNumbers"
                    type="number"
                    value={editData.totalNumbers || 0}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Assigned Numbers"
                    name="assignedNumbers"
                    type="number"
                    value={editData.assignedNumbers || 0}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Total Monthly Cost"
                    name="totalMonthlyCost"
                    type="number"
                    value={editData.totalMonthlyCost || 0}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                />
                <Box sx={editCountryStatsFormStyles.buttonContainer}>
                    <Button onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleSave(onSave, countryStat)}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditCountryStatsForm;