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

    flexAlignCenterGap1Mb1: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1
    } as SxProps<Theme>,

    width120: {
        width: 120
    } as SxProps<Theme>,

    flexGap1: {
        display: 'flex',
        gap: 1
    } as SxProps<Theme>,

    rowCounter: {
        color: '#888'
    } as SxProps<Theme>
};