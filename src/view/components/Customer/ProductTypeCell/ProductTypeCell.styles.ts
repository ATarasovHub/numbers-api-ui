import { SxProps, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { calmTheme } from '../../../theme/theme';

export const productTypeCellStyles = {
    voiceInContainer: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 1.5,
        py: 0.5,
        borderRadius: '16px',
        backgroundColor: alpha(calmTheme.palette.primary.main, 0.15),
        color: calmTheme.palette.primary.main,
        border: `1px solid ${alpha(calmTheme.palette.primary.main, 0.3)}`,
    } as SxProps<Theme>,

    voiceInText: {
        fontWeight: 600,
        fontSize: '0.95rem',
    } as SxProps<Theme>,

    defaultText: {
        fontWeight: 500,
    } as SxProps<Theme>,
};