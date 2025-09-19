import { SxProps, Theme } from '@mui/material/styles';

export const accountDetailsTableStyles = {
    scrollContainer: {
        maxHeight: '400px',
        overflowY: 'auto',
        border: '1px solid #eee',
        borderRadius: 1.5,
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#ccc',
            borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#999',
        },
    } as SxProps<Theme>,

    searchFieldContainer: {
        display: 'flex',
        gap: 1,
        mb: 2,
    } as SxProps<Theme>,

    searchField: {
        '& .MuiInputBase-root': {
            paddingRight: '40px',
        },
    } as SxProps<Theme>,

    actionButton: {
        minWidth: 80,
    } as SxProps<Theme>,

    loaderContainer: {
        display: 'flex',
        justifyContent: 'center',
        py: 3,
    } as SxProps<Theme>,

    emptyMessage: {
        textAlign: 'center',
        py: 3,
    } as SxProps<Theme>,

    tableHeader: {
        backgroundColor: '#f5f5f5',
        fontWeight: 'bold',
    } as SxProps<Theme>,

    tableCell: {
        whiteSpace: 'nowrap',
    } as SxProps<Theme>,
};