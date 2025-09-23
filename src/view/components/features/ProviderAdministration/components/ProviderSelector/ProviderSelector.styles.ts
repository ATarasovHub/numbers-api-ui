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

    flexAlignCenterGap1: {
        display: 'flex',
        alignItems: 'center',
        gap: 1
    } as SxProps<Theme>,

    minWidth200: {
        minWidth: 200
    } as SxProps<Theme>,

    label: {
        minWidth: 70
    } as SxProps<Theme>
};