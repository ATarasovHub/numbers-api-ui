import { SxProps, Theme } from '@mui/material';

export const styles = {
    container: {
        p: 2
    } as SxProps<Theme>,

    breadcrumb: {
        mb: 2
    } as SxProps<Theme>,

    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    } as SxProps<Theme>
};