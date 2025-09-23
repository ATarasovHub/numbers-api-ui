import { SxProps, Theme } from '@mui/material';

export const styles = {
    container: {
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: 'background.paper',
        borderRadius: '12px',
        boxShadow: 4,
    } as SxProps<Theme>,

    title: {
        color: 'text.primary',
        mb: '2rem',
        fontSize: '1.8rem',
        fontWeight: 600,
        textAlign: 'center',
    } as SxProps<Theme>,

    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    } as SxProps<Theme>,

    formSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    } as SxProps<Theme>,

    formRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
    } as SxProps<Theme>,

    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    } as SxProps<Theme>,

    label: {
        fontWeight: 500,
        color: 'text.secondary',
        fontSize: '0.9rem',
    } as SxProps<Theme>,

    input: {
        padding: '0.75rem',
        border: '2px solid divider',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.2s ease',
        backgroundColor: 'background.paper',
        color: 'text.primary',
        '&:focus': {
            outline: 'none',
            borderColor: 'primary.main',
        },
        '&:disabled': {
            backgroundColor: 'action.disabledBackground',
            cursor: 'not-allowed',
        },
    } as SxProps<Theme>,

    countryStatsContainer: {
        border: '1px solid divider',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: 'background.default',
        mb: '1rem',
    } as SxProps<Theme>,

    addButton: {
        backgroundColor: 'secondary.main',
        color: 'secondary.contrastText',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'background-color 0.2s ease',
        '&:hover:not(:disabled)': {
            backgroundColor: 'secondary.dark',
        },
        '&:disabled': {
            backgroundColor: 'action.disabledBackground',
            cursor: 'not-allowed',
        },
    } as SxProps<Theme>,

    submitButton: {
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        border: 'none',
        padding: '0.875rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        '&:hover:not(:disabled)': {
            backgroundColor: 'primary.dark',
        },
        '&:disabled': {
            backgroundColor: 'action.disabledBackground',
            cursor: 'not-allowed',
        },
    } as SxProps<Theme>,

    sectionTitle: {
        color: 'text.primary',
        fontSize: '1.2rem',
        fontWeight: 600,
        mb: '1rem',
    } as SxProps<Theme>,

    rowCounter: {
        color: '#888'
    } as SxProps<Theme>
};