import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { calmTheme } from './theme';

const isVoiceInProduct = (productType: string) => {
    return productType?.toLowerCase().includes('voice in');
};

const ProductTypeCell: React.FC<{ productType?: string | null }> = ({ productType }) => {
    if (productType && isVoiceInProduct(productType)) {
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
        <Typography variant="body2" fontWeight="500" color="text.secondary">
            {productType ?? '-'}
        </Typography>
    );
};

export default ProductTypeCell;
