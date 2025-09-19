// src/view/components/ProductTypeCell/ProductTypeCell.tsx

import React from 'react';
import { Typography, Box } from '@mui/material';
import { productTypeCellStyles } from './ProductTypeCell.styles';

interface Props {
    productType?: string | null;
}

export const ProductTypeCell: React.FC<Props> = ({ productType }) => {
    const isVoiceIn = productType?.toLowerCase().includes('voice in');

    if (isVoiceIn) {
        return (
            <Box sx={productTypeCellStyles.voiceInContainer}>
                <Typography
                    variant="body2"
                    sx={productTypeCellStyles.voiceInText}
                >
                    {productType}
                </Typography>
            </Box>
        );
    }

    return (
        <Typography
            variant="body2"
            sx={productTypeCellStyles.defaultText}
            color="text.secondary"
        >
            {productType ?? '-'}
        </Typography>
    );
};