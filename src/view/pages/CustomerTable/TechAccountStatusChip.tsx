import React from 'react';
import { Chip } from '@mui/material';

const TechAccountStatusChip: React.FC<{ status: string }> = ({ status }) => {
    const color =
        status.toLowerCase() === 'active'
            ? 'success'
            : status.toLowerCase() === 'suspended'
                ? 'error'
                : status.toLowerCase() === 'unknown status'
                    ? 'default'
                    : 'info';
    return <Chip label={status} color={color as any} size="small" />;
};

export default TechAccountStatusChip;
