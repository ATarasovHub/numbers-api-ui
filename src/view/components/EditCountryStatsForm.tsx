import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { CountryStats } from '../../utils/domain';

interface EditCountryStatsFormProps {
    open: boolean;
    onClose: () => void;
    countryStat: CountryStats | null;
    onSave: (updatedStat: CountryStats) => void;
}

const EditCountryStatsForm: React.FC<EditCountryStatsFormProps> = ({ open, onClose, countryStat, onSave }) => {
    const [editData, setEditData] = useState<Partial<CountryStats>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (countryStat) {
            setEditData({
                countryName: countryStat.countryName,
                countryCode: countryStat.countryCode,
                totalNumbers: countryStat.totalNumbers,
                assignedNumbers: countryStat.assignedNumbers,
                totalMonthlyCost: countryStat.totalMonthlyCost,
            });
        }
    }, [countryStat]);

    if (!countryStat) return null;

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        onSave({ ...countryStat, ...editData });
        setIsSaving(false);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, minWidth: 320 }}>
                <Typography variant="h6" mb={2}>Edit Country Statistics</Typography>
                <TextField label="Country Name" name="countryName" value={editData.countryName || ''} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Country Code" name="countryCode" value={editData.countryCode || ''} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Total Numbers" name="totalNumbers" type="number" value={editData.totalNumbers || 0} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Assigned Numbers" name="assignedNumbers" type="number" value={editData.assignedNumbers || 0} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Total Monthly Cost" name="totalMonthlyCost" type="number" value={editData.totalMonthlyCost || 0} onChange={handleEditChange} fullWidth margin="normal" />
                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                    <Button onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={isSaving}>Save</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditCountryStatsForm; 