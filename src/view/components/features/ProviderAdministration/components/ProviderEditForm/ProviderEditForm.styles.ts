import { SxProps, Theme } from '@mui/material';

export const styles = {
    paper: {
        p: 2,
        mb: 2
    } as SxProps<Theme>,

    subtitle1: {
        mb: 2,
        fontWeight: 600
    } as SxProps<Theme>,

    grid: {
        display: 'grid',
        gridTemplateColumns: 'max-content 1fr',
        gap: '12px',
        alignItems: 'center'
    } as SxProps<Theme>,

    placeholderText: {
        color: '#888'
    } as SxProps<Theme>
};