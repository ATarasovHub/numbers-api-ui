import { SxProps, Theme } from '@mui/material/styles';

export const customerFilterStyles = {
    paper: {
        p: 2.5,
        mb: 3,
        borderRadius: 2.5,
    } as SxProps<Theme>,

    filterContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
    } as SxProps<Theme>,

    filterLabel: {
        minWidth: '100px',
        fontWeight: 600,
    } as SxProps<Theme>,

    textField: {
        minWidth: 300,
    } as SxProps<Theme>,
};