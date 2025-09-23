import React from 'react';
import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DeleteButton, EditButton } from './ProvisioningActions.styles';

interface ProvisioningActionsProps {
    onDelete?: () => void;
    onEdit?: () => void;
}

const ProvisioningActions: React.FC<ProvisioningActionsProps> = ({ onDelete, onEdit }) => {
    return (
        <Stack direction="row" spacing={1}>
            <DeleteButton size="small" onClick={onDelete}>
                <DeleteIcon fontSize="small" />
            </DeleteButton>
            <EditButton size="small" onClick={onEdit}>
                <EditIcon fontSize="small" />
            </EditButton>
        </Stack>
    );
};

export default ProvisioningActions;
