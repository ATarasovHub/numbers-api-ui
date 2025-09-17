import { createTheme, alpha } from '@mui/material/styles';

export const calmTheme = createTheme({
    palette: {
        primary: {
            main: '#1e40af',
            light: '#93c5fd',
            dark: '#1e3a8a',
            contrastText: '#fff',
        },
        secondary: {
            main: '#3b82f6',
            light: '#bfdbfe',
            contrastText: '#fff',
        },
        background: {
            default: '#f1f5f9',
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#475569',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: alpha('#3b82f6', 0.1),
                    },
                    '&.Mui-selected': {
                        backgroundColor: alpha('#3b82f6', 0.2),
                        '&:hover': {
                            backgroundColor: alpha('#3b82f6', 0.25),
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 10,
                    '&:hover': {
                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    '&.Mui-focused fieldset': {
                        borderColor: '#1e40af',
                        borderWidth: 2,
                    },
                },
            },
        },
    },
});