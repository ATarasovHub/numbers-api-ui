import React from 'react';
import { Chip } from '@mui/material';
import { techAccountStatusChipStyles } from './TechAccountStatusChip.styles';

interface Props {
    status: string;
}

export const TechAccountStatusChip: React.FC<Props> = ({ status }) => {
    const getColor = (status: string) => {
        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case 'active':
                return 'success';
            case 'suspended':
                return 'error';
            case 'unknown status':
                return 'default';
            default:
                return 'info';
        }
    };

    const color = getColor(status);

    return (
        <Chip
            label={status}
            color={color as any}
            size="small"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            sx={techAccountStatusChipStyles.chip}
        />
    );
};