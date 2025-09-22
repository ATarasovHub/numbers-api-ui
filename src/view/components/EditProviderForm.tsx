import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { NumberProvider } from '../utils/domain';

interface EditProviderFormProps {
    open: boolean;
    onClose: () => void;
    provider: NumberProvider | null;
    onProviderUpdated: (updatedProvider: NumberProvider) => void;
}

const EditProviderForm: React.FC<EditProviderFormProps> = ({ open, onClose, provider, onProviderUpdated }) => {
    const [editData, setEditData] = useState<Partial<NumberProvider>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (provider) {
            setEditData({
                providerName: provider.providerName,
                totalCountries: provider.totalCountries,
                totalNumbers: provider.totalNumbers,
                totalAssignedNumbers: provider.totalAssignedNumbers,
                totalMonthlyCost: provider.totalMonthlyCost,
            });
        }
    }, [provider]);

    if (!provider) return null;

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleEditSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/provider/${provider.providerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });
            if (!res.ok) throw new Error('Failed to update provider');
            const updatedProvider = await res.json();
            onProviderUpdated(updatedProvider);
            onClose();
        } catch (e) {
            alert('Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, minWidth: 320 }}>
                <Typography variant="h6" mb={2}>Edit provider</Typography>
                <TextField label="Provider Name" name="providerName" value={editData.providerName || ''} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Total Countries" name="totalCountries" type="number" value={editData.totalCountries || 0} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Total Numbers" name="totalNumbers" type="number" value={editData.totalNumbers || 0} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Total Assigned Numbers" name="totalAssignedNumbers" type="number" value={editData.totalAssignedNumbers || 0} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Total Monthly Cost" name="totalMonthlyCost" type="number" value={editData.totalMonthlyCost || 0} onChange={handleEditChange} fullWidth margin="normal" />
                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                    <Button onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditSave} disabled={isSaving}>Save</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditProviderForm;
