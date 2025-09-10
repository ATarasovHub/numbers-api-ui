import React from 'react';
import { Typography, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { calmTheme } from './theme';

interface Props {
    productType?: string | null;
}

export const ProductTypeCell: React.FC<Props> = ({ productType }) => {
    const isVoiceIn = productType?.toLowerCase().includes('voice in');

    if (isVoiceIn) {
        return (
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '16px',
                    backgroundColor: alpha(calmTheme.palette.primary.main, 0.15),
                    color: calmTheme.palette.primary.main,
                    border: `1px solid ${alpha(calmTheme.palette.primary.main, 0.3)}`,
                }}
            >
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {productType}
                </Typography>
            </Box>
        );
    }

    return (
        <Typography variant="body2" fontWeight={500} color="text.secondary">
            {productType ?? '-'}
        </Typography>
    );
};